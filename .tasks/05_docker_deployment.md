# Task 05 — Containerization, Deployment & CI Automation

**Goal**: Multi-stage Dockerfile for Rust backend, production Vite build, Render deployment config, environment variable templates, and GitHub Actions CI pipelines.

## Sub-tasks

### 5.1 `backend/Dockerfile` — multi-stage Rust build
- [x] Stage 1 `builder`: `rust:1.85-slim-bookworm` (or `rust:1.75+`)
  - Install build tooling: `pkg-config`, `libssl-dev`, `ca-certificates`
  - Dependency caching layer: copy `Cargo.toml` and build dummy skeleton
  - Release build: `cargo build --release`
- [x] Stage 2 `runtime`: `gcr.io/distroless/cc-debian12`
  - Minimal attack surface: zero shell, zero package manager
  - Copy compiled binary `/app/aura-flora-backend`
  - Copy SSL CA certificates for upstream HTTPS requests
  - `EXPOSE 8080`, `CMD ["/app/aura-flora-backend"]`

### 5.2 `frontend/` — static production build & PWA
- [x] Vite production bundle via `npm run build`
- [x] Service worker generation via `vite-plugin-pwa`
- [x] Web manifest with theme color `#0d1310` and AMOLED `#000000` background

### 5.3 `.env.sample` — environment variable specification
- [x] `PORT=8080`
- [x] `GEMMA_API_KEY=your_google_ai_studio_key`
- [x] `GEMMA_MODEL=gemma-2b-it`
- [x] `ELEVENLABS_API_KEY=your_elevenlabs_key`
- [x] `ELEVENLABS_VOICE_ID=your_voice_id`
- [x] `TABPFN_API_KEY=your_tabpfn_key`
- [x] `TABPFN_ENDPOINT=https://api.priorlabs.ai/v1/tabpfn`
- [x] `RUST_LOG=info`
- [x] `AUDIO_TEMP_DIR=/tmp/aura-flora-audio`

### 5.4 `render.yaml` — cloud deployment blueprint
- [x] Service type: `web`
- [x] Build command: `cd backend && cargo build --release`
- [x] Start command: `./backend/target/release/aura-flora-backend`
- [x] Environment mapping matching `.env.sample`

### 5.5 `.dockerignore`
- [x] Exclude: `target/`, `frontend/node_modules/`, `frontend/dist/`, `*.md`, `.git/`, `.tasks/`, `.agent/`

### 5.6 CI Automation (`.github/workflows/`)
- [x] `rust-ci.yml`: runs `cargo fmt --check`, `cargo clippy --all-targets --all-features -- -D warnings`, and `cargo test`
- [x] `frontend-ci.yml`: runs `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`

## Build & Test Commands

### Backend Docker Container
```bash
# Build backend image
docker build -t aura-flora-backend:latest ./backend

# Run locally with environment variables
docker run --env-file .env -p 8080:8080 aura-flora-backend:latest

# Verify health endpoint
curl http://localhost:8080/health
```

### Frontend Production Bundle
```bash
# In frontend/
npm run build
npm run preview
```

## Acceptance Criteria
- Multi-stage Docker image compiles cleanly into distroless container <60MB
- All environment variables documented in `.env.sample`
- Zero unused legacy mobile dependencies in `.dockerignore` or build configurations
- GitHub Actions CI pipelines validate both backend and frontend on pull request
