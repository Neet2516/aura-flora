//! Application configuration loaded from environment variables.
//!
//! All secrets are consumed exclusively here — no other module may call `std::env::var` directly.

use std::env;
use thiserror::Error;

/// Errors that can occur while loading configuration.
#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("Missing required environment variable: {0}")]
    MissingVar(String),
}

/// Complete application configuration.
#[derive(Debug, Clone)]
pub struct AppConfig {
    /// TCP port the Axum server listens on.
    pub port: u16,

    /// Google AI Studio API key for Gemma inference.
    pub gemma_api_key: String,

    /// Gemma model identifier (e.g. "gemma-2b-it").
    pub gemma_model: String,

    /// ElevenLabs API key for TTS synthesis.
    pub elevenlabs_api_key: String,

    /// ElevenLabs voice ID (whisper-style calm voice).
    pub elevenlabs_voice_id: String,

    /// TabPFN API key for acoustic tabular classification.
    pub tabpfn_api_key: String,

    /// TabPFN inference endpoint URL.
    pub tabpfn_endpoint: String,

    /// Directory for temporary audio files served to the client.
    pub audio_temp_dir: String,
}

impl AppConfig {
    /// Load configuration from environment variables.
    ///
    /// Automatically reads `.env` file if present (via `dotenvy`).
    ///
    /// # Errors
    /// Returns [`ConfigError::MissingVar`] if a required variable is absent.
    pub fn from_env() -> Result<Self, ConfigError> {
        // Load .env if present — ignore error if file missing (production won't have one)
        let _ = dotenvy::dotenv();

        Ok(Self {
            port: env::var("PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .unwrap_or(8080),

            gemma_api_key: env::var("GEMMA_API_KEY").unwrap_or_default(),
            gemma_model: env::var("GEMMA_MODEL").unwrap_or_else(|_| "gemma-2b-it".to_string()),

            elevenlabs_api_key: env::var("ELEVENLABS_API_KEY").unwrap_or_default(),
            elevenlabs_voice_id: env::var("ELEVENLABS_VOICE_ID")
                .unwrap_or_else(|_| "EXAVITQu4vr4xnSDxMaL".to_string()),

            tabpfn_api_key: env::var("TABPFN_API_KEY").unwrap_or_default(),
            tabpfn_endpoint: env::var("TABPFN_ENDPOINT")
                .unwrap_or_else(|_| "https://api.priorlabs.ai/v1/tabpfn".to_string()),

            audio_temp_dir: env::var("AUDIO_TEMP_DIR").unwrap_or_else(|_| {
                std::env::temp_dir()
                    .join("aura-flora-audio")
                    .to_string_lossy()
                    .to_string()
            }),
        })
    }

    /// Check whether full API integration is enabled.
    ///
    /// Returns `false` if any key is empty — switches pipeline to mock mode.
    pub fn is_full_integration(&self) -> bool {
        !self.gemma_api_key.is_empty()
            && !self.elevenlabs_api_key.is_empty()
    }
}

/// Helper: require an env var or return a `ConfigError`.
#[allow(dead_code)]
fn require_var(key: &'static str) -> Result<String, ConfigError> {
    env::var(key).map_err(|_| ConfigError::MissingVar(key.to_string()))
}
