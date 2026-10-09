//! POST /api/v1/ground — core grounding pipeline handler.
//!
//! Accepts a base64-encoded 16-bit PCM WAV audio blob,
//! runs the full DSP → classify → prompt → TTS pipeline,
//! and returns a structured grounding response.

use std::sync::Arc;

use axum::{extract::State, Json};
use base64::{engine::general_purpose::STANDARD, Engine};
use serde::{Deserialize, Serialize};
use tracing::info;

use crate::config::AppConfig;
use crate::dsp::{self, AcousticFeatures};
use crate::handlers::AppError;
use crate::services::{gemma_service, tabpfn_service, tabpfn_service::ClassificationResult, tts_service};

/// Shared application state passed to all handlers.
pub type AppState = Arc<AppConfig>;

/// Request body for the grounding endpoint.
#[derive(Debug, Deserialize)]
pub struct GroundRequest {
    /// Base64-encoded raw 16-bit signed PCM audio (16 kHz, mono).
    pub audio_b64: String,

    /// Sample rate of the audio (expected: 16000).
    #[serde(default = "default_sample_rate")]
    pub sample_rate: u32,
}

fn default_sample_rate() -> u32 {
    16000
}

/// Response body returned to the Flutter client.
#[derive(Debug, Serialize)]
pub struct GroundResponse {
    /// Single-sentence physical outdoor grounding instruction.
    pub prompt: String,

    /// Relative URL to the synthesized MP3 audio file.
    pub audio_url: String,

    /// Extracted acoustic features (for client-side display).
    pub features: AcousticFeatures,

    /// Environment classification result.
    pub classification: ClassificationResult,
}

/// POST /api/v1/ground handler.
///
/// Pipeline:
/// 1. Decode base64 audio → f32 PCM samples
/// 2. Extract acoustic features (FFT + spectral analysis)
/// 3. Classify environment via TabPFN (or heuristic fallback)
/// 4. Generate grounding prompt via Gemma (or curated fallback)
/// 5. Synthesize audio via ElevenLabs (or silence fallback)
/// 6. Return structured response
pub async fn ground_handler(
    State(config): State<AppState>,
    Json(request): Json<GroundRequest>,
) -> Result<Json<GroundResponse>, AppError> {
    info!("Received grounding request, sample_rate={}", request.sample_rate);

    // --- Step 1: Decode base64 audio ---
    let raw_bytes = STANDARD
        .decode(&request.audio_b64)
        .map_err(|e| AppError::BadRequest(format!("Invalid base64 audio: {}", e)))?;

    if raw_bytes.len() < 512 {
        return Err(AppError::BadRequest(
            "Audio too short — minimum 512 bytes required".to_string(),
        ));
    }

    // Convert 16-bit PCM bytes to f32 samples (little-endian)
    let pcm_samples = decode_pcm_i16_to_f32(&raw_bytes);

    info!("Decoded {} PCM samples ({:.2}s)", pcm_samples.len(),
        pcm_samples.len() as f32 / request.sample_rate as f32);

    // --- Step 2: Extract acoustic features ---
    let features = dsp::extract_features(&pcm_samples, request.sample_rate);

    info!(
        centroid = %features.spectral_centroid,
        entropy = %features.spectral_entropy,
        biophony = %features.biophony_ratio,
        rms_db = %features.rms_db,
        "Acoustic features extracted"
    );

    // --- Step 3: Classify environment ---
    let classification = tabpfn_service::classify(&features, &config).await?;

    // --- Step 4: Generate grounding prompt ---
    let prompt = gemma_service::generate_prompt(&features, &classification, &config).await?;

    // --- Step 5: Synthesize TTS audio ---
    let (_file_path, audio_url) = tts_service::synthesize(&prompt, &config).await?;

    info!(
        environment = %classification.environment_tag,
        audio_url = %audio_url,
        "Grounding pipeline complete"
    );

    Ok(Json(GroundResponse {
        prompt,
        audio_url,
        features,
        classification,
    }))
}

/// Convert raw little-endian 16-bit PCM bytes to normalized f32 samples.
fn decode_pcm_i16_to_f32(bytes: &[u8]) -> Vec<f32> {
    bytes
        .chunks_exact(2)
        .map(|chunk| {
            let sample = i16::from_le_bytes([chunk[0], chunk[1]]);
            sample as f32 / i16::MAX as f32
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_decode_pcm_i16_round_trip() {
        // Encode i16::MAX as little-endian bytes, decode should give ≈ 1.0
        let bytes = vec![0xFF, 0x7F]; // i16::MAX = 32767
        let samples = decode_pcm_i16_to_f32(&bytes);
        assert_eq!(samples.len(), 1);
        assert!((samples[0] - 1.0).abs() < 0.0001);
    }

    #[test]
    fn test_decode_pcm_zero() {
        let bytes = vec![0x00, 0x00];
        let samples = decode_pcm_i16_to_f32(&bytes);
        assert_eq!(samples[0], 0.0);
    }

    #[test]
    fn test_decode_pcm_odd_bytes_ignored() {
        // chunks_exact(2) should ignore trailing odd byte
        let bytes = vec![0xFF, 0x7F, 0xAA]; // 3 bytes = 1 complete i16 + 1 ignored
        let samples = decode_pcm_i16_to_f32(&bytes);
        assert_eq!(samples.len(), 1);
    }
}
