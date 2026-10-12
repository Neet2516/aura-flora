# AuraFlora — Agent Rules & Project Constraints

> **Hacktoberfest 2026 · "Touch Grass" Challenge**
> BioAcoustic Grounding Companion — Anti-Screen Mobile App

---

## 🌿 Core Philosophy

AuraFlora exists to **pull people out of the digital world** and into the physical one.
Every design decision must serve that mission.

---

## ⚖️ Zero-Screen-Time Laws (Non-Negotiable)

1. **15-Second Rule**: The entire screen interaction — from app open to blackout — MUST complete in ≤ 15 seconds.
2. **No Engagement Loops**: Absolutely zero streaks, badges, points, leaderboards, push notifications, or dopamine mechanics.
3. **Blackout is Terminal**: Once the ElevenLabs audio begins, the UI enters `#000000` full blackout. No UI elements visible except a 10% opacity hint.
4. **Double-Tap Exit Only**: The blackout screen can only be dismissed via double-tap gesture. No visible back button, no swipe gesture, no timer exit.
5. **No Social Features**: No sharing, no friends list, no profiles, no telemetry beyond anonymized acoustic feature vectors.

---

## 🏗️ Architecture Constraints

### Rust Backend (`/backend`)
- Framework: `axum` with `tokio` async runtime.
- FFT: `rustfft` for spectral feature extraction.
- All API keys loaded **only** from environment variables via `config.rs`. Never hardcoded.
- Audio payload: raw 16-bit PCM WAV, 16 kHz mono, base64-encoded in JSON body.
- Response contract: `{ prompt: string, audio_url: string, features: AcousticFeatures }`.
- All handlers must return typed `Result<Json<T>, AppError>`.
- `AppError` implements `IntoResponse` for clean HTTP error propagation.

### React 19 Frontend (`/frontend`)
- Framework: React 19 + TypeScript + Vite + PWA (Workbox).
- State management: `useGroundingSession` hook managing the lifecycle (idle → recording → analyzing → speaking → blackout).
- Audio recording & synthesis: `soundEngine.ts` using Web Audio API (16 kHz mono signed 16-bit PCM capture, live AnalyserNode FFT).
- API client: `api.ts` with transparent on-device acoustic analysis fallback.
- Navigation / Display: Direct transition from Home/Simulator to pure `#000000` AMOLED blackout.
- Double-tap exit: Wake-up gesture registered via double-click / double-tap (`handleDoubleTapToWake`).
- No external analytics SDKs (Firebase, Amplitude, Mixpanel) — ever.

### AI Pipeline
- **TabPFN Proxy**: Classifies biophony ratio → `{ biophony_score: f32, anthrophony_score: f32, environment_tag: string }`.
- **Gemma**: Receives acoustic features + environment tag → outputs single-sentence tactile outdoor prompt.
- **ElevenLabs**: Whisper voice model, streaming audio, proxied through Rust backend.

---

## 🎨 Design System

### Color Tokens
| Token           | Hex       | Usage                              |
|-----------------|-----------|------------------------------------|
| `forest-deep`   | `#0A0F0D` | Primary background                 |
| `moss-muted`    | `#1F2E23` | Card / surface background          |
| `herbal`        | `#4E8752` | Primary accent, CTAs               |
| `sand`          | `#E8DFD8` | Primary text, icons                |
| `blackout`      | `#000000` | Blackout screen background         |

### Typography
- Font: **Inter** (Google Fonts) or system sans-serif fallback.
- Sizes: 12/14/16/20/24/32sp only.

### Animation Constraints
- **Breathing Pulse**: Subtle scale oscillation (0.97 → 1.03, 3s period) on the record button.
- **Blackout Fade**: 800ms linear fade to `#000000`.
- **Maximum Animation Duration**: 1200ms for any UI transition.

---

## 🔒 Security Rules
- `GEMMA_API_KEY`, `ELEVENLABS_API_KEY`, `TABPFN_API_KEY` — Rust env vars only.
- Frontend `.env` — `VITE_BACKEND_URL` only. Never expose private provider credentials in client bundles.
- Docker image: multi-stage build, final stage is `gcr.io/distroless/cc-debian12`.

---

## 🧪 Testing Policy
- Rust: `cargo test` must pass; `cargo clippy -- -D warnings` must be clean; `cargo fmt --check` clean.
- Frontend: `npm run lint` (oxlint), `npm run typecheck` (tsc -b), `npm test` (vitest), and `npm run build` must all pass clean.
- No `#[allow(dead_code)]` or `#[allow(unused)]` without a documented reason.

---

## 📁 File Ownership
| Directory                    | Responsibility                                |
|------------------------------|-----------------------------------------------|
| `/backend/src/dsp/`          | Signal processing only — no HTTP, no AI      |
| `/backend/src/services/`     | External API clients only — no DSP            |
| `/backend/src/handlers/`     | HTTP glue only — compose DSP + services      |
| `/frontend/src/components/`  | UI presentation and simulators                |
| `/frontend/src/hooks/`       | State machine hooks (`useGroundingSession`)   |
| `/frontend/src/services/`    | Sound engine, API client, key management      |
| `/frontend/src/constants/`   | Design tokens, biomes, acoustic presets       |
