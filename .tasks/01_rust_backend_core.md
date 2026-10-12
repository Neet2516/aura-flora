# Task 01 — Rust Backend Core

**Goal**: Stand up the Axum HTTP server with DSP FFT pipeline, strongly typed API endpoints, async concurrency guards, and comprehensive test suite.

## Sub-tasks

### 1.1 `backend/Cargo.toml` — workspace manifest
- [x] Package `aura-flora-backend`, edition 2021
- [x] Dependencies: `axum 0.8`, `tokio` (full), `serde`/`serde_json`, `rustfft`, `reqwest`, `tower-http`, `tracing`, `tracing-subscriber`, `base64`, `dotenv`, `anyhow`, `thiserror`
- [x] Dev dependencies: `tower` (service call testing), `hyper`

### 1.2 `src/config.rs` — environment configuration
- [x] Struct `AppConfig` with validated fields: `port`, `gemma_api_key`, `elevenlabs_api_key`, `tabpfn_api_key`, `gemma_model`, `elevenlabs_voice_id`, `tabpfn_endpoint`, `audio_temp_dir`
- [x] `AppConfig::from_env()` — safe loading from environment with sensible local defaults and fallback handling

### 1.3 `src/dsp/acoustic_features.rs` — signal processing & feature extraction
- [x] `AcousticFeatures` struct: `spectral_centroid: f32`, `spectral_entropy: f32`, `biophony_ratio: f32`, `rms_db: f32`, `zero_crossing_rate: f32`
- [x] `extract_features(pcm_samples: &[f32], sample_rate: u32) -> AcousticFeatures`
- [x] FFT via `rustfft`, power spectrum calculation
- [x] Spectral centroid = weighted mean frequency across magnitude spectrum
- [x] Spectral entropy = Shannon entropy of normalized power distribution
- [x] Biophony ratio = acoustic energy in 2–8 kHz biological band vs. total energy
- [x] RMS calculation in dBFS (`20 * log10(rms)`)
- [x] Zero-crossing rate normalized by sample count

### 1.4 `src/handlers/ground.rs` & `src/handlers/errors.rs` — API endpoints & error handling
- [x] Accept `GroundRequest { audio_b64: String, sample_rate: Option<u32> }`
- [x] Validation gates:
  - `sample_rate`: between 8,000 Hz and 48,000 Hz (defaults to 16,000 Hz)
  - `audio_b64`: decoded size between 512 bytes and 2,097,152 bytes (2 MB limit)
- [x] Tokio concurrency guard: CPU-bound FFT signal processing executed inside `tokio::task::spawn_blocking` to prevent starving the async runtime worker threads
- [x] Typed `AppError` enum with Axum `IntoResponse` mapping:
  - `InvalidInput` → 400 Bad Request
  - `AudioDecodeError` → 400 Bad Request
  - `DeductionFailed` / `ServiceError` → 500 Internal Server Error with sanitized error messages
- [x] Return `GroundResponse` with `prompt`, `audio_url`, `features`, `classification`, and `provider_status`

### 1.5 `src/lib.rs` & `src/main.rs` — modular architecture & file serving
- [x] `src/lib.rs` provides `create_app(state: Arc<AppState>) -> Router` enabling lightweight in-memory HTTP integration testing
- [x] `src/main.rs` provides minimal runtime entry point listening on `0.0.0.0:8080`
- [x] `GET /health` returns `{"status":"ok","version":"0.1.0","service":"aura-flora-backend"}`
- [x] `GET /audio/:filename` with path traversal sanitization (rejection of `..` or forbidden paths)
- [x] CORS middleware (`tower-http`) configured for dev and production origins
- [x] Shared `AppState` wrapping `Arc<AppConfig>` and `reqwest::Client`

### 1.6 Integration & Unit Test Suite (`tests/integration_test.rs`)
- [x] 23 comprehensive tests covering:
  - Synthetic sine wave FFT feature extraction (spectral centroid, biophony ratio, RMS dB)
  - Edge cases: silent buffers, DC offset, Nyquist boundary signals
  - Endpoint tests: `GET /health`, `POST /api/v1/ground` with valid mono PCM
  - Negative validation tests: invalid sample rates (<8k, >48k), oversized buffers, corrupted base64
  - Path traversal attack prevention tests on `/audio/` routes

## Acceptance Criteria
- `cargo test` passes all 23 tests
- `cargo clippy --all-targets --all-features -- -D warnings` completes with zero warnings
- `cargo fmt --check` succeeds
- `GET /health` returns 200 OK
- `POST /api/v1/ground` responds in <2s with complete acoustic telemetry
