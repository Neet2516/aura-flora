# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-10-12

### Added
- **Tokio Offload for DSP**: FFT and spectral feature extraction are offloaded via `tokio::task::spawn_blocking` to prevent blocking the async runtime.
- **Strict Audio Validation**: Added sample rate bounds (8,000–48,000 Hz) and buffer size checks (512 B min, 2 MB max) to prevent memory exhaustion and malformed payloads.
- **Provider Status Transparency**: `ProviderStatus` contract added to API responses (`gemma_live`, `tabpfn_live`, `elevenlabs_live`) for honest reporting of AI providers.
- **Shared Grounding Session Hook**: Added `useGroundingSession` in React frontend to unify session lifecycles, race-condition mitigation tokens, and timer cleanups.
- **Integration Test Suite**: Added 7 comprehensive Axum integration tests validating health checks, path traversal resistance, payload limits, and audio grounding.
- **Frontend Test Suite**: Added Vitest test suite for pure audio resampling, 16-bit PCM conversion, base64 encoding, and API client fallback behaviors.
- **Continuous Integration**: Added GitHub Actions workflow (`.github/workflows/ci.yml`) covering Rust formatting, Clippy, tests, frontend linting, typechecking, and builds.

### Changed
- **Eliminated Fake MP3 Files**: Removed silent dummy MP3 generation when ElevenLabs is unconfigured; returns clean `{ audio_url: "", is_synthesized: false }` metadata.
- **Cleaned Docker Configurations**: Removed hardcoded ISP DNS resolver entries (`103.99.186.6`) and updated `docker-compose.yml` to use `VITE_BACKEND_URL`.
- **Improved Type Safety**: Upgraded frontend API layer and sound engine to strict TypeScript with safe `unknown` error handling and zero `any` leaks.

## [0.1.0] - 2026-10-10

### Added
- Initial release of AuraFlora with Axum backend, Web Audio 16 kHz capture, and anti-screen blackout protocol.
