# AuraFlora — Agent & Contributor Technical Guide

This guide is designed for AI coding agents and human engineers contributing to the AuraFlora repository. It documents architectural boundaries, design invariants, API contracts, and quality gates.

---

## 1. Architectural Boundaries & System Structure

```text
aura-flora/
├── backend/                  # Rust Axum microservice (DSP, AI orchestration)
│   ├── src/
│   │   ├── lib.rs            # create_app router builder & AppState
│   │   ├── main.rs           # Runtime listener entry point
│   │   ├── config.rs         # Strongly typed Config with env validation
│   │   ├── dsp/              # Pure acoustic signal processing & feature extraction
│   │   ├── handlers/         # Thin Axum HTTP handlers & AppError mapping
│   │   ├── models/           # GroundRequest, GroundResponse, AcousticFeatures
│   │   └── services/         # Gemma, TabPFN, ElevenLabs integrations
│   └── tests/
│       └── integration_test.rs # Axum HTTP integration test suite
├── frontend/                 # React 19 + TypeScript + Vite + PWA
│   ├── src/
│   │   ├── components/       # Presentation components (MobileSimulator, etc.)
│   │   ├── hooks/            # useGroundingSession (central interaction state)
│   │   ├── services/         # soundEngine (Web Audio API), api (HTTP client)
│   │   └── types.ts          # Shared TypeScript contracts matching backend
│   └── tests / __tests__/    # Vitest suites for audio DSP & API clients
└── .github/workflows/        # CI automation (Rust + Frontend)
```

### Boundary Rules
- **Backend**: Keep Axum handlers thin. Put CPU-heavy DSP work in `dsp/` executed via `tokio::task::spawn_blocking`. Keep AI client calls inside `services/`.
- **Frontend**: Keep React components focused on UI and rendering. Delegate session lifecycles, timer countdowns, and race-condition cancellation tokens to `useGroundingSession`.
- **API Contracts**: Defined in `backend/src/models/mod.rs` and mirrored in `frontend/src/types.ts`. Any contract change must be kept in lockstep.

---

## 2. Invariants & User Experience Rules

1. **≤ 15-Second Screen Time Protocol**:
   - The entire user interaction loop (Record 5–6s → Backend analysis ~2s → Spoken prompt ~4s → Blackout) must complete in under 15 seconds.
   - Never introduce gamification, badges, streaks, leaderboards, or feed mechanics.
2. **AMOLED Blackout Screen**:
   - The blackout screen is terminal (`#000000`). Exit is triggered **only** by double-tap (`onDoubleClick` / double-click event).
   - Zero background photon emissions; keep it completely dark to enforce the "Touch Grass" detox principle.
3. **Audio Truthfulness**:
   - Never fabricate acoustic telemetry or generate silent dummy MP3 files when ElevenLabs is missing.
   - Return transparent `ProviderStatus` (`is_synthesized: false`) and let the frontend use browser speech synthesis or visual whisper.

---

## 3. Key Development Commands

### Backend (Rust)
```bash
# In backend/
cargo fmt --check                                     # Check formatting
cargo clippy --all-targets --all-features -- -D warnings # Lint with zero warnings
cargo test                                            # Run all unit and integration tests
cargo run                                             # Start service on 0.0.0.0:8080
```

### Frontend (React / Vite)
```bash
# In frontend/
npm run lint       # Run oxlint
npm run typecheck  # Run tsc -b
npm test           # Run Vitest test suite
npm run build      # Build production bundle with Vite & PWA
npm run dev        # Start dev server on http://localhost:5173
```

---

## 4. API Request & Response Contracts

### `POST /api/v1/ground`

**Request:**
```json
{
  "audio_b64": "<base64 encoded 16-bit mono PCM>",
  "sample_rate": 16000
}
```
*Validation:* `sample_rate` between `8000` and `48000` Hz; decoded audio between `512` bytes and `2,097,152` bytes.

**Response:**
```json
{
  "prompt": "Notice the faint rustling of the leaves above.",
  "audio_url": "/audio/grounding_...mp3",
  "features": {
    "spectral_centroid": 2450.5,
    "spectral_entropy": 1.15,
    "biophony_ratio": 0.82,
    "rms_db": -24.3,
    "zero_crossing_rate": 0.18
  },
  "classification": {
    "biophony_score": 0.82,
    "anthrophony_score": 0.18,
    "environment_tag": "forest"
  },
  "provider_status": {
    "gemma_live": true,
    "tabpfn_live": false,
    "elevenlabs_live": true
  }
}
```

### `GET /audio/:filename`
Streams the generated MP3 session file with `Content-Type: audio/mpeg`. Sanitizes input against path traversal.

### `GET /health`
Returns service status: `{"status": "ok", "version": "0.1.0", "service": "aura-flora-backend"}`.

---

## 5. Common Pitfalls & Guardrails

- **Do Not Block Tokio**: Signal processing (FFT, spectral calculations) is CPU-bound. Always execute it inside `tokio::task::spawn_blocking` in handlers.
- **Race Condition Prevention in Frontend**: Rapid tapping or concurrent requests must be dropped. Check `sessionToken` validity in `useGroundingSession` before applying asynchronous responses.
- **Never Commit Secrets**: Check `.env` and `.gitignore`. Do not expose server keys (`GEMMA_API_KEY`, `ELEVENLABS_API_KEY`) to Vite build variables (`VITE_*`).
- **Preserve Visual Design**: Do not alter the aesthetic styling, color tokens, or AMOLED blackout visuals unless explicitly addressing a confirmed defect.
