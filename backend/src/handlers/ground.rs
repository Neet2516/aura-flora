//! POST /api/v1/ground — core grounding pipeline handler.
//!
//! Accepts a base64-encoded 16-bit PCM WAV audio blob,
//! runs the full DSP → classify → prompt → TTS pipeline,
//! and returns a structured grounding response with provider transparency.

use std::sync::Arc;

use axum::{extract::State, Json};
use base64::{engine::general_purpose::STANDARD, Engine};
use serde::{Deserialize, Serialize};
use tracing::info;

use crate::config::AppConfig;
use crate::dsp::{self, AcousticFeatures};
use crate::handlers::AppError;
use crate::services::{
    gemma_service,
    tabpfn_service::{self, ClassificationResult},
    tts_service,
};

/// Shared application state passed to all handlers.
pub type AppState = Arc<AppConfig>;

/// Request body for the grounding endpoint.
#[derive(Debug, Deserialize)]
pub struct GroundRequest {
    /// Base64-encoded raw 16-bit signed PCM audio (16 kHz, mono).
    pub audio_b64: String,

    /// Sample rate of the audio (expected: 16000, allowed: 8000–48000).
    #[serde(default = "default_sample_rate")]
    pub sample_rate: u32,
}

fn default_sample_rate() -> u32 {
    16000
}

/// Provider execution mode indicators.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderStatus {
    /// True if Gemma 2B-IT generated the prompt, false if fallback was used.
    pub gemma_live: bool,

    /// True if TabPFN classified the environment, false if heuristic was used.
    pub tabpfn_live: bool,

    /// True if ElevenLabs generated spoken speech, false if TTS was skipped/failed.
    pub elevenlabs_live: bool,
}

/// Response body returned to client applications.
#[derive(Debug, Serialize)]
pub struct GroundResponse {
    /// Single-sentence physical outdoor grounding instruction.
    pub prompt: String,

    /// Relative URL to the synthesized MP3 audio file (or empty if ungenerated).
    pub audio_url: String,

    /// Extracted acoustic features (for client-side visualizers & telemetry).
    pub features: AcousticFeatures,

    /// Environment classification result.
    pub classification: ClassificationResult,

    /// Provider transparency telemetry.
    pub provider_status: ProviderStatus,
}

/// POST /api/v1/ground handler.
///
/// Pipeline:
/// 1. Validate payload length & sample rate constraints
/// 2. Decode base64 audio → f32 PCM samples
/// 3. Offload DSP feature extraction to blocking thread pool (prevents async starvation)
/// 4. Classify environment via TabPFN (or heuristic fallback)
/// 5. Generate grounding prompt via Gemma (or curated fallback)
/// 6. Synthesize audio via ElevenLabs (or return empty audio URL honestly)
/// 7. Return structured response with provider transparency
pub async fn ground_handler(
    State(config): State<AppState>,
    Json(request): Json<GroundRequest>,
) -> Result<Json<GroundResponse>, AppError> {
    info!(
        sample_rate = request.sample_rate,
        "Received bioacoustic grounding request"
    );

    // Validate sample rate bounds
    if request.sample_rate < 8000 || request.sample_rate > 48000 {
        return Err(AppError::bad_request(
            "INVALID_SAMPLE_RATE",
            format!(
                "Sample rate {} Hz out of supported range (8000–48000 Hz)",
                request.sample_rate
            ),
        ));
    }

    // Step 1: Decode base64 audio
    let raw_bytes = STANDARD.decode(&request.audio_b64).map_err(|e| {
        AppError::bad_request("INVALID_BASE64", format!("Invalid base64 audio: {}", e))
    })?;

    // Validate audio size bounds (512 bytes min, ~2 MB max to protect memory)
    if raw_bytes.len() < 512 {
        return Err(AppError::bad_request(
            "AUDIO_TOO_SHORT",
            "Audio too short — minimum 512 bytes required for spectral analysis",
        ));
    }

    if raw_bytes.len() > 2_000_000 {
        return Err(AppError::payload_too_large(
            "Audio payload exceeds maximum supported buffer (2 MB / ~15s)",
        ));
    }

    // Convert 16-bit PCM bytes to normalized f32 samples
    let pcm_samples = decode_pcm_i16_to_f32(&raw_bytes);
    let sample_rate = request.sample_rate;

    info!(
        samples = pcm_samples.len(),
        duration_s = (pcm_samples.len() as f32 / sample_rate as f32),
        "Decoded PCM audio buffer"
    );

    // Step 2: Offload CPU-heavy FFT signal processing to Tokio blocking pool
    let features =
        tokio::task::spawn_blocking(move || dsp::extract_features(&pcm_samples, sample_rate))
            .await
            .map_err(|e| AppError::internal(format!("DSP task execution panicked: {}", e)))?;

    info!(
        centroid = %features.spectral_centroid,
        entropy = %features.spectral_entropy,
        biophony = %features.biophony_ratio,
        rms_db = %features.rms_db,
        "Acoustic features computed successfully"
    );

    // Step 3: Classify acoustic environment
    let classification_output = tabpfn_service::classify(&features, &config).await?;

    // Step 4: Generate grounding prompt
    let prompt_output =
        gemma_service::generate_prompt(&features, &classification_output.classification, &config)
            .await?;

    // Step 5: Synthesize TTS audio (honest status reporting, no fake silent MP3)
    let tts_output = tts_service::synthesize(&prompt_output.prompt, &config).await?;

    let provider_status = ProviderStatus {
        gemma_live: prompt_output.is_live_inference,
        tabpfn_live: classification_output.is_live_model,
        elevenlabs_live: tts_output.is_synthesized,
    };

    info!(
        environment = %classification_output.classification.environment_tag,
        audio_url = %tts_output.audio_url,
        gemma_live = provider_status.gemma_live,
        elevenlabs_live = provider_status.elevenlabs_live,
        "Grounding pipeline finished cleanly"
    );

    Ok(Json(GroundResponse {
        prompt: prompt_output.prompt,
        audio_url: tts_output.audio_url,
        features,
        classification: classification_output.classification,
        provider_status,
    }))
}

/// Convert raw little-endian 16-bit PCM bytes to normalized f32 samples.
#[allow(unknown_lints, clippy::chunks_exact_to_as_chunks)]
pub fn decode_pcm_i16_to_f32(bytes: &[u8]) -> Vec<f32> {
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
        let bytes = vec![0xFF, 0x7F]; // i16::MAX = 32767
        let samples = decode_pcm_i16_to_f32(&bytes);
        assert_eq!(samples.len(), 1);
        assert!((samples[0] - 1.0).abs() < 0.0001);
    }

    #[test]
    fn test_decode_pcm_zero() {
        let bytes = vec![0x00, 0x00];
        let samples = decode_pcm_i16_to_f32(&bytes);
        assert_eq!(samples.len(), 1);
        assert_eq!(samples[0], 0.0);
    }

    #[test]
    fn test_decode_pcm_odd_bytes_ignored() {
        let bytes = vec![0x00, 0x00, 0xAA];
        let samples = decode_pcm_i16_to_f32(&bytes);
        assert_eq!(samples.len(), 1);
    }
}
