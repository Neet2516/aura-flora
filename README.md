<div align="center">
  <h1>🌿 AuraFlora</h1>
  <p><strong>BioAcoustic Grounding Companion</strong></p>
  <p><em>Hacktoberfest 2026 · "Touch Grass" Challenge</em></p>
  <p>
    <img src="https://img.shields.io/badge/Rust-1.75+-orange?logo=rust" />
    <img src="https://img.shields.io/badge/Flutter-3.19+-blue?logo=flutter" />
    <img src="https://img.shields.io/badge/License-MIT-green" />
    <img src="https://img.shields.io/badge/Screen%20Time-≤15s-black" />
  </p>
</div>

---

## What is AuraFlora?

AuraFlora is an **anti-screen mobile application** that gets you off your phone and into the physical world in under 15 seconds.

1. **Press** — Tap the single record button.
2. **Listen** — The app captures 5–10 seconds of your ambient environment through the microphone.
3. **Ground** — The Rust backend analyzes the soundscape (biophony vs anthrophony) and generates a tactile outdoor grounding instruction via Gemma AI.
4. **Blackout** — ElevenLabs whispers the instruction to you, the screen goes pure `#000000`, and you go outside.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Flutter Mobile (Android/iOS)                               │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │ HomeScreen   │  │ BlackoutScr │  │ GroundingProvider │  │
│  │ PulseListener│  │ #000000     │  │ (Riverpod SM)     │  │
│  └──────┬───────┘  └─────────────┘  └─────────┬─────────┘  │
│         │ record (16kHz WAV)                   │            │
│         └─────────────────────────────────────►│            │
│                                    POST /api/v1/ground      │
└────────────────────────────────────────────────┼────────────┘
                                                 │ base64 WAV
                                                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Rust Backend (Axum + Tokio)                                │
│                                                             │
│  ┌─────────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │ DSP / rustfft   │   │ TabPFN svc   │   │ Gemma svc   │  │
│  │ spectral centrd │──►│ biophony vs  │──►│ 1-sentence  │  │
│  │ biophony ratio  │   │ anthrophony  │   │ prompt gen  │  │
│  │ entropy / RMS   │   └──────────────┘   └──────┬──────┘  │
│  └─────────────────┘                            │          │
│                                                 ▼          │
│                                        ┌─────────────────┐ │
│                                        │ ElevenLabs TTS  │ │
│                                        │ whisper voice   │ │
│                                        │ → /audio/{id}   │ │
│                                        └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Backend

```bash
# Prerequisites: Rust 1.75+
cd backend
cp ../.env.sample .env  # Fill in your API keys
cargo run
# → Listening on 0.0.0.0:8080

# Test health
curl http://localhost:8080/health
# → {"status":"ok","version":"0.1.0","service":"aura-flora-backend"}
```

### Flutter App

```bash
# Prerequisites: Flutter 3.19+ (stable)
cd mobile
flutter pub get
flutter run
```

---

## Environment Variables

See [`.env.sample`](.env.sample) for all required variables.

| Variable | Required | Description |
|---|---|---|
| `GEMMA_API_KEY` | ✅ | Google AI Studio key for Gemma 2B-IT |
| `ELEVENLABS_API_KEY` | ✅ | ElevenLabs key for TTS synthesis |
| `ELEVENLABS_VOICE_ID` | ✅ | Voice ID (calm, whisper-style) |
| `TABPFN_API_KEY` | ⬜ | TabPFN classification (heuristic fallback if absent) |
| `PORT` | ⬜ | Server port (default: 8080) |

> **Mock Mode**: If `GEMMA_API_KEY` or `ELEVENLABS_API_KEY` is absent, the backend uses curated fallback prompts and a silent MP3. Perfect for local development.

---

## Project Structure

```
aura-flora/
├── .agent/          # Agent rules, workflows, design constraints
├── .tasks/          # Concrete implementation task checklists (01–05)
├── backend/         # Rust (Axum) — DSP, AI orchestration, HTTP
│   ├── src/
│   │   ├── dsp/     # FFT, spectral centroid, biophony ratio
│   │   ├── services/# Gemma, TabPFN, ElevenLabs clients
│   │   └── handlers/# HTTP request handlers
│   └── Dockerfile   # Multi-stage → distroless
└── mobile/          # Flutter app (Android + iOS)
    └── lib/
        ├── core/    # Design tokens, typography, constants
        ├── services/# Audio recording, playback, API client
        ├── state/   # Riverpod state machine
        └── presentation/ # Screens + widgets
```

---

## Zero-Screen-Time Laws

- ⏱️ **15-second rule** — entire interaction must complete in ≤ 15s
- 🚫 **No streaks, no badges, no notifications, no social features**
- ⬛ **Blackout is terminal** — exit only by double-tap
- 🎤 **One button** — the entire UI is a single record button

---

## Deployment (Render)

```bash
# Build Docker image
docker build -t aura-flora-backend ./backend

# Deploy via render.yaml (auto-detected by Render)
git push origin main
```

See [`render.yaml`](render.yaml) for full Render Web Services config.

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
  <sub>Built for Hacktoberfest 2026 · Touch Grass Challenge · Go outside. 🌱</sub>
</div>
