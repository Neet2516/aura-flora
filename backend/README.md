# AuraFlora Backend

Rust Axum bioacoustic microservice responsible for acoustic signal processing (FFT), TabPFN classification, Gemma grounding instruction generation, and ElevenLabs speech synthesis.

## Architecture

- **Web Framework**: [Axum](https://github.com/tokio-rs/axum) on [Tokio](https://tokio.rs/)
- **Digital Signal Processing (DSP)**: [rustfft](https://crates.io/crates/rustfft) (spectral centroid, zero-crossing rate, RMS dB, biophony vs anthrophony energy ratios)
- **AI Orchestration**:
  - `gemma_service`: Google AI Studio Gemma 2B-IT for contextual outdoor grounding instructions
  - `tabpfn_service`: Prior Labs TabPFN tabular classifier for soundscape biophony scoring
  - `elevenlabs_service`: ElevenLabs TTS with calm whisper voice profile
- **Concurrency**: CPU-bound FFT operations are safely isolated via `tokio::task::spawn_blocking`.

## Directory Structure

```text
backend/
├── src/
│   ├── lib.rs              # App router builder and shared state
│   ├── main.rs             # Runtime entrypoint & TCP listener
│   ├── config.rs           # Environment variable validation & Config struct
│   ├── dsp/
│   │   ├── mod.rs
│   │   └── acoustic_features.rs # Pure FFT & spectral calculations
│   ├── handlers/
│   │   ├── mod.rs          # AppError enum and HTTP error status mapping
│   │   ├── health.rs       # GET /health
│   │   ├── audio.rs        # GET /audio/:filename (sanitized audio delivery)
│   │   └── ground.rs       # POST /api/v1/ground
│   ├── models/             # API request/response structs
│   └── services/           # External AI service clients (Gemma, TabPFN, ElevenLabs)
├── tests/
│   └── integration_test.rs # HTTP end-to-end integration tests
├── Cargo.toml
└── Dockerfile              # Distroless production container
```

## Running & Testing

```bash
# Check formatting
cargo fmt --check

# Check clippy linter
cargo clippy --all-targets --all-features -- -D warnings

# Run all unit and integration tests
cargo test

# Run local development server
cargo run
```

## API Endpoints

- `GET /health` — Service health check.
- `POST /api/v1/ground` — Accepts 16 kHz mono PCM base64 audio, computes DSP features, generates grounding prompt, and synthesizes audio.
- `GET /audio/:filename` — Serves generated audio files securely.
