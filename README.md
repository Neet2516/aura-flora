<div align="center">
  <h1>🌿 AuraFlora</h1>
  <p><strong>BioAcoustic Grounding Companion</strong></p>
  <p><em>Hacktoberfest 2026 · "Touch Grass" Challenge</em></p>
  <p>
    <a href="https://github.com/Neet2516/aura-flora/actions/workflows/ci.yml"><img src="https://github.com/Neet2516/aura-flora/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
    <a href="https://aura-flora-ashen.vercel.app/"><img src="https://img.shields.io/badge/Demo-Live%20on%20Vercel-success?logo=vercel" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Rust-1.75+-orange?logo=rust" alt="Rust" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-8+-purple?logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/PWA-Ready-green?logo=pwa" alt="PWA" />
    <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT" />
    <img src="https://img.shields.io/badge/Screen%20Time-≤15s-black" alt="Screen Time" />
  </p>
  <p>
    <a href="https://aura-flora-ashen.vercel.app/"><strong>🌐 Live Web App</strong></a> · 
    <a href="https://github.com/Neet2516/aura-flora"><strong>💻 GitHub Repository</strong></a> · 
    <a href="https://aura-flora-ashen.vercel.app/"><strong>🎥 Video Walkthrough / Submission</strong></a>
  </p>
</div>

---

## 🌿 AuraFlora — An AI Companion That Tells You When to Put Your Phone Down

What if technology could help you disconnect from technology?

Meet **AuraFlora**, a bioacoustic grounding companion built for the Hacktoberfest 2026 “Touch Grass” challenge. Instead of keeping you glued to another screen, AuraFlora encourages you to pause, listen to the world around you, and reconnect with the present moment.

### 🎧 How It Works
1. 🎙️ **Listen:** Capture a short sample of your surrounding ambient sounds.
2. 🌱 **Analyze:** Extract acoustic features to explore the soundscape around you.
3. 🧠 **Understand:** Use AI to generate a short, context-aware grounding instruction.
4. 🔊 **Reconnect:** Hear your grounding prompt and step away from the screen.
5. 🖤 **Disconnect:** Enter a distraction-free black screen experience designed to bring your attention back to the real world.

### ⚙️ Tech Stack
- **Frontend:** React, TypeScript, Vite, PWA
- **Backend:** Rust, Axum, Tokio
- **Digital Signal Processing:** `rustfft`
- **AI:** Gemma (2B-IT)
- **Text-to-Speech:** ElevenLabs
- **Mobile:** Flutter & Riverpod

### 🌍 The Idea Behind AuraFlora

We build technology to capture attention. AuraFlora explores a different approach: using technology to help us give that attention back to the world around us.

The goal is simple — less scrolling, more listening, and more moments of genuine connection with nature.

### 🚀 Project Links
- 🌐 **Website:** [aura-flora-ashen.vercel.app](https://aura-flora-ashen.vercel.app/)
- 💻 **GitHub Repository:** [https://github.com/Neet2516/aura-flora](https://github.com/Neet2516/aura-flora)
- 🎥 **Video Demo / Submission:** [Watch Project Demo & Video Walkthrough](https://aura-flora-ashen.vercel.app/)

> If you believe technology should help us live better beyond our screens, **like the video, share your thoughts in the comments, and star the repository on GitHub!** ⭐
>
> `#AuraFlora` `#Hacktoberfest2026` `#TouchGrass` `#OpenSource` `#ArtificialIntelligence` `#Rust` `#React` `#Gemma` `#DigitalWellbeing` `#Bioacoustics`

---

## 📊 Current Project Status

| Component | Status | Details |
|---|:---:|---|
| **Web Application (React 19 + Vite PWA)** | 🟢 **Live & Deployed** | Hosted at [aura-flora-ashen.vercel.app](https://aura-flora-ashen.vercel.app/). 16 kHz native mic recording, dynamic procedural soundscapes, and AMOLED blackout. |
| **Rust Axum Microservice** | 🟢 **Production Ready** | Tokio non-blocking runtime (`spawn_blocking` for FFT DSP), typed error responses, 23/23 tests passing, zero Clippy warnings. |
| **Acoustic DSP Engine (`rustfft`)** | 🟢 **Operational** | Real-time spectral centroid, entropy, zero-crossing rate (ZCR), RMS dB, and biophony/anthrophony energy classification. |
| **AI Orchestration (Gemma & ElevenLabs)** | 🟢 **Operational** | Live Gemma prompt synthesis with graceful offline fallback; ElevenLabs voice synthesis with transparent browser speech synthesis fallback. |
| **CI / CD Quality Gates** | 🟢 **Passing** | GitHub Actions CI running `cargo fmt`, `cargo clippy`, `cargo test`, `oxlint`, `tsc -b`, `vitest`, and `vite build`. |

---

## Application Interface & Interaction Flow

<div align="center">
  <img src="docs/images/auraflora_flow_showcase.png" alt="AuraFlora Interaction Flow Showcase" width="100%" />
</div>

### Core Stages (≤ 15-Second Screen Time Protocol)

| 1. Ambient Audio Capture | 2. Bio-Score Classification | 3. AMOLED Blackout Lock |
| :---: | :---: | :---: |
| <img src="docs/images/01_audio_listening.png" width="280" alt="AuraFlora Listening & Capturing Audio" /> | <img src="docs/images/02_bioscore_classification.png" width="280" alt="Bio-Score Classification & Telemetry" /> | <img src="docs/images/03_blackout_lockscreen.png" width="280" alt="AMOLED Blackout Lock Screen" /> |
| **Stage 01: Capture**<br>• Real 16 kHz Mono PCM audio recording<br>• Dynamic audio waveform & pulse animation<br>• 5–6s session countdown (≤15s total budget) | **Stage 02: Classification**<br>• Real-time Biophony vs. Anthrophony ratio (88%)<br>• Spectral centroid, entropy & RMS features<br>• 1-sentence outdoor grounding whisper (Gemma AI) | **Stage 03: Blackout**<br>• Pure `#000000` AMOLED display shutoff<br>• Zero backlight photon emission<br>• Terminal lock (double-tap to wake) |

<br/>

<div align="center">
  <h3>Interactive Demo Recording & Video Walkthrough</h3>
  <p><em>Live interaction loop: 16 kHz capture → DSP biophony classification → AMOLED blackout detox</em></p>
  <img src="docs/images/auraflora_demo.gif" width="320" alt="AuraFlora Interactive Flow Demo Animation" />
  <p>
    <a href="https://aura-flora-ashen.vercel.app/"><strong>🌐 Open Live App Demo</strong></a> · 
    <a href="https://github.com/Neet2516/aura-flora"><strong>💻 View Source Code</strong></a>
  </p>
</div>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  React 19 + Vite PWA (Web Audio API / Mobile Simulator)     │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │ MobileSim    │  │ BlackoutScr │  │ SoundEngine       │  │
│  │ PulseListener│  │ #000000     │  │ (Web Audio API)   │  │
│  └──────┬───────┘  └─────────────┘  └─────────┬─────────┘  │
│         │ record (16kHz PCM Base64)            │            │
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

### Frontend (React + Vite + PWA)

```bash
# Prerequisites: Node.js 18+
cd frontend
npm install
npm run dev
# → Listening on http://localhost:5173
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

> **Local / Offline Mode**: If `GEMMA_API_KEY` or `ELEVENLABS_API_KEY` is absent, the backend serves curated biome-specific grounding instructions with clear provider transparency (`provider_status.elevenlabs_live: false`), and the client provides spoken whisper via local browser speech synthesis.

---

## Quality & Testing Gates

Run the verification suites locally before submitting changes:

### Backend (Rust)

```bash
cd backend
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
```

### Frontend (React / Vite)

```bash
cd frontend
npm run lint       # oxlint
npm run typecheck  # tsc -b
npm test           # vitest run
npm run build      # production build
```

---

## Project Structure

```
aura-flora/
├── .agent/          # Agent rules, workflows, design constraints
├── .tasks/          # Implementation task checklists (01–05)
├── .github/         # CI workflows and issue/PR templates
├── backend/         # Rust (Axum) — DSP, AI orchestration, HTTP
│   ├── src/
│   │   ├── dsp/     # FFT, spectral centroid, biophony ratio (spawn_blocking)
│   │   ├── services/# Gemma, TabPFN, ElevenLabs clients
│   │   ├── handlers/# Axum request handlers & AppError mapping
│   │   └── lib.rs   # Router builder and application state
│   ├── tests/       # End-to-end integration tests
│   └── Dockerfile   # Multi-stage → distroless
└── frontend/        # React 19 + TypeScript + Vite + PWA
    ├── src/
    │   ├── components/  # Mobile simulator, Audio visualizers, Lab
    │   ├── hooks/       # useGroundingSession state machine
    │   ├── services/    # SoundEngine (Web Audio API), ApiService
    │   ├── constants/   # Audio presets & design tokens
    │   └── types.ts     # Acoustic telemetry & classification types
    ├── tests/           # Vitest unit test suites
    └── public/          # PWA manifests, icons, audio assets
```

---

## Zero-Screen-Time Laws

- ⏱️ **15-second rule** — entire interaction must complete in ≤ 15s
- 🚫 **No streaks, no badges, no notifications, no social features**
- ⬛ **Blackout is terminal** — exit only by double-tap
- 🎤 **One button** — the entire UI is a single record button

---

## Open Source & Community

- [Contributing Guidelines](CONTRIBUTING.md) — Setup, PR process, and code quality expectations
- [Security Policy](SECURITY.md) — Audio data privacy and vulnerability reporting
- [Code of Conduct](CODE_OF_CONDUCT.md) — Community standards (Contributor Covenant 2.1)
- [Agent & Contributor Guide](AGENTS.md) — Technical invariants, contracts, and guardrails
- [Changelog](CHANGELOG.md) — Release notes and version history

---

## Deployment (Render & Docker)

```bash
# Build Docker image
docker build -t aura-flora-backend ./backend

# Run with docker-compose
docker-compose up --build
```

See [`render.yaml`](render.yaml) for full Render Web Services config.

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
  <sub>Built for Hacktoberfest 2026 · Touch Grass Challenge · Go outside. 🌱</sub>
</div>
