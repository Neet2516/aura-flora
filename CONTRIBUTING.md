# Contributing to AuraFlora

Thank you for your interest in contributing to AuraFlora! We welcome contributions that maintain or improve the anti-screen grounding experience, acoustic DSP algorithms, and open-source code quality.

## Principles & Non-Negotiables

1. **≤ 15-Second Screen Time Protocol**: AuraFlora exists to break digital loops and get users outside. Do not add gamification, badges, streaks, engagement hooks, or infinite scrolls.
2. **True Acoustic Fidelity**: Feature extraction (spectral centroid, zero-crossing rate, RMS dB, biophony ratio) must accurately reflect signal properties. Never fabricate bioacoustic scores.
3. **Explicit Error Handling & Honesty**: Never hide provider failures behind silent fallbacks or fake audio files. If speech synthesis is unconfigured, return transparent status flags (`is_synthesized: false`).
4. **Strict Quality Gates**: All CI checks (formatting, linting, type checks, unit tests) must pass before a pull request can be merged.

---

## Development Setup

### Prerequisites

- **Rust**: `1.75+` (with `cargo`, `rustfmt`, and `clippy`)
- **Node.js**: `20+` (with `npm`)
- **Docker** (optional): for containerized multi-service validation

### 1. Clone the Repository

```bash
git clone https://github.com/Neet2516/aura-flora.git
cd aura-flora
```

### 2. Configure Environment

Copy `.env.sample` into `.env` (or configure separate `.env` files in `backend/` and `frontend/`):

```bash
cp .env.sample .env
```

Set any optional API keys:
- `GEMMA_API_KEY`: Google AI Studio key for live Gemma prompt generation
- `ELEVENLABS_API_KEY` & `ELEVENLABS_VOICE_ID`: ElevenLabs speech synthesis
- `TABPFN_API_KEY`: Prior Labs TabPFN tabular acoustic classification

*Note: The application runs cleanly in offline/local heuristic mode if keys are omitted.*

---

## Verification Commands

Run these checks locally before opening a pull request:

### Backend (Rust)

```bash
cd backend
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
```

### Frontend (React / TypeScript / Vite)

```bash
cd frontend
npm run lint
npm run typecheck
npm test
npm run build
```

---

## Pull Request Guidelines

1. **Branch Naming**: Use descriptive branch names:
   - `fix/dsp-zcr-normalization`
   - `feat/acoustic-entropy-calculation`
   - `docs/clarify-api-contracts`
2. **Atomic Commits**: Keep commits focused and provide clear, descriptive commit messages.
3. **No Secrets in Commits**: Verify that `.env` files and private API credentials are never added to git.
4. **Follow Architecture**:
   - Backend logic belongs in domain services (`backend/src/services/`) or DSP modules (`backend/src/dsp/`), keeping Axum route handlers thin.
   - Frontend components stay focused on presentation and user interaction, delegating session lifecycle and audio processing to `useGroundingSession` and `soundEngine`.

Thank you for helping people reconnect with the living world! 🌱
