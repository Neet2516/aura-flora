# AuraFlora — Project Execution & Git Commit Lock

> **Hacktoberfest 2026 "Touch Grass" Challenge**  
> **Anti-Screen BioAcoustic Grounding Companion**

---

## 1. Git Commit History & Lock State

The repository history is strictly tracked using Conventional Commits. Below is the immutable log of all commits locking features, architectural layers, and tests:

| Commit Hash | Author / Date | Conventional Commit Message & Scope |
|-------------|---------------|--------------------------------------|
| `9cc1675`   | AuraFlora Dev | `chore: initialize repo with gitignore, README, env sample, and deploy configs` |
| `1826c6c`   | AuraFlora Dev | `docs(agent): add project rules, design system, and workflow guides` |
| `9acbfbb`   | AuraFlora Dev | `docs(tasks): add full implementation task checklists 01-05` |
| `9903fe4`   | AuraFlora Dev | `feat(backend): initialize Axum server with config, health check, and router` |
| `3cce815`   | AuraFlora Dev | `feat(backend/dsp): implement FFT acoustic feature extraction` |
| `e34f169`   | AuraFlora Dev | `feat(backend/services): implement AI orchestration pipeline` |
| `a74c643`   | AuraFlora Dev | `feat(backend): add multi-stage Dockerfile targeting distroless runtime` |
| `48931a2`   | AuraFlora Dev | `feat(mobile): scaffold Flutter app with services and state machine` |
| `f0d9185`   | AuraFlora Dev | `feat(mobile/ui): implement AMOLED HomeScreen, BlackoutScreen, and widgets` |
| `e3aba2a`   | AuraFlora Dev | `test(mobile): add widget tests for HomeScreen and BlackoutScreen` |
| `HEAD`      | AuraFlora Dev | `fix(backend): resolve cargo run startup errors, harden Dockerfile, lock Cargo.lock and scaffold platform trees` |

---

## 2. Zero-Local-Install Execution (Docker)

To run the AuraFlora backend without needing to install Rust, Cargo, or any local toolchains, Docker is used.

### Option A: Docker Compose (Recommended)

Bring up the entire backend container with a single command:

```bash
docker compose up --build -d
```

To stop:
```bash
docker compose down
```

### Option B: Docker CLI Direct Build & Run

From the project root:

```bash
# 1. Build the production multi-stage Distroless Docker image
docker build --add-host index.crates.io:151.101.66.137 --add-host static.crates.io:151.101.66.137 -t aura-flora-backend:latest -f backend/Dockerfile backend

# 2. Run the container on port 8080
docker run -d --name aura-flora-app -p 8080:8080 aura-flora-backend:latest

# 3. View live server logs
docker logs -f aura-flora-app
```

---

## 3. Verifying the Execution Process

### Step 1: Health Liveness Check

```bash
# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/health"

# Linux / macOS / curl
curl -i http://localhost:8080/health
```

**Expected Response**:
```json
{
  "service": "aura-flora-backend",
  "status": "ok",
  "version": "0.1.0"
}
```

### Step 2: Grounding Pipeline Ingestion Test

Simulate 512 samples of raw 16-bit PCM audio (16 kHz, mono) sent to the bioacoustic DSP pipeline:

```powershell
$sampleBytes = New-Object byte[] 1024;
(New-Object Random).NextBytes($sampleBytes);
$b64 = [Convert]::ToBase64String($sampleBytes);
$body = @{ audio_b64 = $b64; sample_rate = 16000 } | ConvertTo-Json;
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/ground" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 5
```

**Expected Response (Mock / Development Mode)**:
```json
{
  "prompt": "Place your bare hand on the nearest tree bark and trace its texture for thirty seconds.",
  "audio_url": "/audio/b02c2eac-cc51-4fa3-86a9-6168683af4cb.mp3",
  "features": {
    "spectral_centroid": 3949.54,
    "spectral_entropy": 7.47,
    "biophony_ratio": 0.727,
    "rms_db": -4.99,
    "zero_crossing_rate": 0.491
  },
  "classification": {
    "biophony_score": 0.727,
    "anthrophony_score": 0.273,
    "environment_tag": "forest"
  }
}
```

### Step 3: Stream Synthesized Whisper Audio

```bash
curl -I "http://localhost:8080/audio/{audio_filename}.mp3"
```

**Response**:
- Status: `200 OK`
- Header: `Content-Type: audio/mpeg`
- Cache-Control: `no-cache, no-store`

---

## 4. Local Development Execution (Optional)

If Rust is installed locally:

```bash
cd backend
cargo check
cargo test        # 16 unit tests passing
cargo run         # Starts Axum server on port 8080 (binds 0.0.0.0:8080)
```

---

## 5. Complete Folder Structure

### Root Architecture
```
aura-flora/
├── .agent/                       # AI Agent rules & developer guidelines
│   ├── rules.md
│   └── workflows/
├── .tasks/                       # Hacktoberfest task checklists (01 to 05)
├── .env.sample                   # Environment variable template
├── .gitignore                    # Git exclusions (Cargo.lock tracked for binary locking)
├── .dockerignore                 # Docker build context exclusions
├── docker-compose.yml            # Compose configuration for backend service
├── Dockerfile                    # Root multi-stage Dockerfile
├── EXECUTION.md                  # Project execution lock & audit ledger
├── README.md                     # Project overview and vision
└── render.yaml                   # Cloud deployment manifest
```

### Backend (`/backend`)
```
backend/
├── Cargo.toml                    # Package manifest & release profiles (lto, strip)
├── Cargo.lock                    # Dependency lockfile (version-locked)
├── Dockerfile                    # Builder (rust:1-slim) -> Runtime (distroless/cc-debian12)
└── src/
    ├── main.rs                   # Entry point: Axum router, CORS, audio file serving
    ├── config.rs                 # Safe configuration loader (mock mode on missing keys)
    ├── dsp/                      # Digital Signal Processing module
    │   ├── mod.rs                # DSP facade & acoustic feature types
    │   └── acoustic_features.rs  # FFT, spectral centroid, spectral entropy, biophony ratio
    ├── services/                 # External API integrations & fallbacks
    │   ├── mod.rs
    │   ├── gemma_service.rs      # Google AI Studio Gemma 2B-IT prompt generator
    │   ├── tabpfn_service.rs     # TabPFN environmental acoustic classifier
    │   └── tts_service.rs        # ElevenLabs whisper TTS synthesis & temp file lifecycle
    └── handlers/                 # HTTP endpoints
        ├── mod.rs                # AppError and JSON error formatting
        └── ground.rs             # POST /api/v1/ground orchestration pipeline
```

### Mobile (`/mobile`)
```
mobile/
├── pubspec.yaml                  # Flutter dependencies (record, audioplayers, riverpod, dio)
├── analysis_options.yaml         # Linter rules & code quality standards
├── assets/                       # Audio and visual assets
│   └── sounds/
│       └── .gitkeep
├── android/                      # Android native platform configuration
│   ├── build.gradle
│   └── app/
│       ├── build.gradle
│       └── src/main/AndroidManifest.xml  # RECORD_AUDIO, INTERNET, WAKE_LOCK permissions
├── ios/                          # iOS native platform configuration
│   └── Runner/
│       └── Info.plist            # NSMicrophoneUsageDescription audio permission
├── lib/
│   ├── main.dart                 # Application entry point with ProviderScope
│   ├── core/
│   │   ├── constants/
│   │   │   └── app_constants.dart # Backend endpoints, 15s UX timing limits
│   │   └── theme/
│   │       ├── app_colors.dart    # Pure AMOLED #000000, bioluminescent green #10B981
│   │       └── app_typography.dart
│   ├── presentation/
│   │   ├── screens/
│   │   │   ├── home_screen.dart   # Interactive touch grass pulse button
│   │   │   └── blackout_screen.dart # Pure AMOLED #000000 lock screen
│   │   └── widgets/
│   │       ├── pulse_listener.dart # Animated circular breathing indicator
│   │       └── sensory_badge.dart  # Acoustic biophony vs anthrophony metrics
│   ├── services/
│   │   ├── api_client.dart        # Dio HTTP client for /api/v1/ground
│   │   ├── audio_player_service.dart # Audioplayers playback controller
│   │   └── audio_recorder_service.dart # Record package 16 kHz PCM capture
│   └── state/
│       └── grounding_provider.dart # StateNotifier pipeline state machine
└── test/
    ├── home_screen_test.dart      # Widget tests for home UI and buttons
    └── blackout_screen_test.dart  # Widget tests for pure AMOLED blackout
```

---

## 6. Configuration Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `PORT` | No | `8080` | Port for Axum HTTP server |
| `AUDIO_TEMP_DIR` | No | `/tmp/aura-flora-audio` | Temporary directory for generated MP3s |
| `RUST_LOG` | No | `info` | Logging verbosity (`info`, `debug`, `trace`) |
| `GEMMA_API_KEY` | Optional | `""` (mock fallback) | Google AI Studio API Key for Gemma 2B |
| `GEMMA_MODEL` | No | `gemma-2b-it` | Model identifier |
| `ELEVENLABS_API_KEY` | Optional | `""` (mock fallback) | ElevenLabs API Key for Whisper TTS |
| `ELEVENLABS_VOICE_ID`| No | `EXAVITQu4vr4xnSDxMaL` | Voice model ID |
| `TABPFN_API_KEY` | Optional | `""` (mock fallback) | PriorLabs TabPFN classification key |
| `TABPFN_ENDPOINT` | No | `https://api.priorlabs.ai/v1/tabpfn` | TabPFN API endpoint |

*Note: In development and testing without API keys, AuraFlora operates automatically in mock mode with curated tactile prompts, mathematical acoustic heuristic classification, and silent MP3 generation.*
