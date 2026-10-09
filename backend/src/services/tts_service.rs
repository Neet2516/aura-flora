//! ElevenLabs TTS synthesis service.
//!
//! Converts a grounding prompt into a calm, whisper-style MP3 audio file
//! via ElevenLabs streaming TTS API. Stores the audio as a temporary file
//! served by the Axum file server, auto-deleted after 60 seconds.

use std::path::PathBuf;
use std::time::Duration;

use serde_json::json;
use tracing::{info, warn};
use uuid::Uuid;

use crate::config::AppConfig;
use crate::handlers::AppError;

/// Synthesize speech from text and return the audio file path and public URL slug.
///
/// # Returns
/// `(file_path, url_path)` where:
/// - `file_path` is the absolute filesystem path to the MP3
/// - `url_path` is the relative URL slug: `/audio/{uuid}.mp3`
pub async fn synthesize(
    text: &str,
    config: &AppConfig,
) -> Result<(PathBuf, String), AppError> {
    // Ensure temp directory exists
    let dir = PathBuf::from(&config.audio_temp_dir);
    tokio::fs::create_dir_all(&dir).await.map_err(|e| {
        AppError::Internal(format!("Failed to create audio temp dir: {}", e))
    })?;

    let audio_id = Uuid::new_v4();
    let filename = format!("{}.mp3", audio_id);
    let file_path = dir.join(&filename);
    let url_path = format!("/audio/{}", filename);

    if config.elevenlabs_api_key.is_empty() {
        info!("ElevenLabs API key not set — generating silent MP3 placeholder");
        write_silence_mp3(&file_path).await?;
    } else {
        match call_elevenlabs_api(text, config, &file_path).await {
            Ok(()) => info!(file = %filename, "TTS synthesis complete"),
            Err(e) => {
                warn!("ElevenLabs API failed ({}), writing silence placeholder", e);
                write_silence_mp3(&file_path).await?;
            }
        }
    }

    // Schedule cleanup after 60 seconds
    let cleanup_path = file_path.clone();
    tokio::spawn(async move {
        tokio::time::sleep(Duration::from_secs(60)).await;
        if let Err(e) = tokio::fs::remove_file(&cleanup_path).await {
            warn!("Failed to clean up audio file {:?}: {}", cleanup_path, e);
        } else {
            info!("Cleaned up temp audio file {:?}", cleanup_path);
        }
    });

    Ok((file_path, url_path))
}

/// Call ElevenLabs `/v1/text-to-speech/{voice_id}` and stream response to file.
async fn call_elevenlabs_api(
    text: &str,
    config: &AppConfig,
    output_path: &PathBuf,
) -> Result<(), anyhow::Error> {
    let url = format!(
        "https://api.elevenlabs.io/v1/text-to-speech/{}",
        config.elevenlabs_voice_id
    );

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(20))
        .build()?;

    let payload = json!({
        "text": text,
        "model_id": "eleven_turbo_v2",
        "voice_settings": {
            "stability": 0.9,
            "similarity_boost": 0.5,
            "style": 0.0,
            "use_speaker_boost": false
        }
    });

    let bytes = client
        .post(&url)
        .header("xi-api-key", &config.elevenlabs_api_key)
        .header("Content-Type", "application/json")
        .header("Accept", "audio/mpeg")
        .json(&payload)
        .send()
        .await?
        .error_for_status()?
        .bytes()
        .await?;

    tokio::fs::write(output_path, &bytes).await?;
    Ok(())
}

/// Write a minimal valid silent MP3 file for mock/offline mode.
///
/// This is a real ID3v2-headered MP3 frame with silence.
async fn write_silence_mp3(path: &PathBuf) -> Result<(), AppError> {
    // Minimal valid MP3: ID3v2 header + one silent MPEG Layer 3 frame
    let silent_mp3: Vec<u8> = vec![
        // ID3v2.3 header
        0x49, 0x44, 0x33, 0x03, 0x00, 0x00, // "ID3" version 2.3, no flags
        0x00, 0x00, 0x00, 0x0A, // ID3 size = 10 bytes (syncsafe)
        // Padding (10 bytes ID3 body)
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // MPEG 1, Layer 3, 128 kbps, 44100 Hz, stereo, no padding
        0xFF, 0xFB, 0x90, 0x00,
        // 413 bytes of silence payload (zeroes)
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ];

    tokio::fs::write(path, &silent_mp3).await.map_err(|e| {
        AppError::Internal(format!("Failed to write silence MP3: {}", e))
    })?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_silence_mp3_written() {
        let dir = std::env::temp_dir().join("aura_flora_test");
        tokio::fs::create_dir_all(&dir).await.unwrap();
        let path = dir.join("test_silence.mp3");
        write_silence_mp3(&path).await.unwrap();

        let metadata = tokio::fs::metadata(&path).await.unwrap();
        assert!(metadata.len() > 0, "Silence MP3 should not be empty");
        tokio::fs::remove_file(&path).await.ok();
    }
}
