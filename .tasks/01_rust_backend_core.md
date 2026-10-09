# Task 01 — Rust Backend Core

**Goal**: Stand up the Axum HTTP server with DSP FFT pipeline and typed API endpoints.

## Sub-tasks

### 1.1 Cargo.toml — workspace manifest
- [x] Define `[package]` with name `aura-flora-backend`, edition 2021
- [x] Add dependencies: `axum`, `tokio` (full), `serde`/`serde_json`, `rustfft`, `reqwest`, `tower-http`, `tracing`, `tracing-subscriber`, `base64`, `dotenv`, `anyhow`, `thiserror`

### 1.2 `src/config.rs` — environment config
- [x] Struct `AppConfig` with fields: `port`, `gemma_api_key`, `elevenlabs_api_key`, `tabpfn_api_key`, `gemma_model`, `elevenlabs_voice_id`
- [x] `AppConfig::from_env()` — load all fields from env vars with clear error messages

### 1.3 `src/dsp/acoustic_features.rs` — signal processing
- [x] `AcousticFeatures` struct: `spectral_centroid: f32`, `spectral_entropy: f32`, `biophony_ratio: f32`, `rms_db: f32`, `zero_crossing_rate: f32`
- [x] `extract_features(pcm_samples: &[f32], sample_rate: u32) -> AcousticFeatures`
- [x] FFT via `rustfft`, compute power spectrum
- [x] Spectral centroid = weighted mean of frequency × magnitude
- [x] Spectral entropy = Shannon entropy of normalized power spectrum
- [x] Biophony ratio = energy in 2–8 kHz band / total energy (birdsong, insects, wind)
- [x] RMS in dBFS
- [x] Zero-crossing rate

### 1.4 `src/handlers/ground.rs` — POST /api/v1/ground
- [x] Accept `GroundRequest { audio_b64: String }` JSON
- [x] Decode base64 → raw PCM f32 samples
- [x] Call `dsp::extract_features`
- [x] Call `tabpfn_service::classify`
- [x] Call `gemma_service::generate_prompt`
- [x] Call `tts_service::synthesize`
- [x] Return `GroundResponse { prompt: String, audio_url: String, features: AcousticFeatures }`

### 1.5 `src/main.rs` — Axum router
- [x] Health check: `GET /health`
- [x] Ground: `POST /api/v1/ground`
- [x] CORS middleware (tower-http)
- [x] Tracing subscriber initialization
- [x] Shared `AppState` via `Arc<AppConfig>`

## Acceptance Criteria
- `cargo build --release` succeeds with zero warnings
- `GET /health` returns `{"status":"ok","version":"0.1.0"}`
- `POST /api/v1/ground` with valid base64 WAV returns structured response
