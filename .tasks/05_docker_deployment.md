# Task 05 — Docker & Deployment

**Goal**: Multi-stage Dockerfile for Rust backend, Render deployment config, environment variable samples.

## Sub-tasks

### 5.1 `backend/Dockerfile` — multi-stage build
- [x] Stage 1 `builder`: `rust:1.75-slim-bookworm`
  - Install `ca-certificates`, `pkg-config`, `libssl-dev`
  - Copy `Cargo.toml` + `Cargo.lock`, build deps only (layer cache)
  - Copy `src/`, `cargo build --release`
- [x] Stage 2 `runtime`: `gcr.io/distroless/cc-debian12`
  - Copy binary from builder
  - Copy `ca-certificates` for HTTPS calls
  - `EXPOSE 8080`, `CMD ["/app/aura-flora-backend"]`

### 5.2 `.env.sample` — environment variable template
- [x] `PORT=8080`
- [x] `GEMMA_API_KEY=your_google_ai_studio_key`
- [x] `GEMMA_MODEL=gemma-2b-it`
- [x] `ELEVENLABS_API_KEY=your_elevenlabs_key`
- [x] `ELEVENLABS_VOICE_ID=your_voice_id`
- [x] `TABPFN_API_KEY=your_tabpfn_key`
- [x] `TABPFN_ENDPOINT=https://api.priorlabs.ai/v1/tabpfn`
- [x] `RUST_LOG=info`
- [x] `AUDIO_TEMP_DIR=/tmp/aura-flora-audio`

### 5.3 `render.yaml` — Render Web Services config
- [x] Service type: `web`
- [x] Build command: `cd backend && cargo build --release`
- [x] Start command: `./backend/target/release/aura-flora-backend`
- [x] Environment: all keys from `.env.sample` as secrets

### 5.4 `.dockerignore`
- [x] Exclude: `target/`, `*.md`, `.git/`, `mobile/`, `.tasks/`, `.agent/`

## Build Commands (local dev)
```bash
# Build image
docker build -t aura-flora-backend:latest ./backend

# Run locally (with env file)
docker run --env-file .env -p 8080:8080 aura-flora-backend:latest

# Test health
curl http://localhost:8080/health
```

## Acceptance Criteria
- Docker image builds in < 5 minutes on first run
- Final image size < 50MB
- All env vars documented in `.env.sample`
- `render.yaml` valid YAML
