# Task 03 — React Web Audio Core & Acoustic Processing

**Goal**: Implement native Web Audio API 16 kHz microphone recording, PCM sample conversion, bioacoustic analysis, and Rust backend API integration with on-device fallback.

## Sub-tasks

### 3.1 `frontend/package.json` — dependencies & tooling
- [x] React 19 + TypeScript 5+ + Vite 8
- [x] `vite-plugin-pwa` — Progressive Web App service worker and offline web manifest
- [x] `framer-motion` & `gsap` — micro-animations, breathing pulses, and layout transitions
- [x] `lucide-react` — clean minimalist icons (`Mic`, `Volume2`, `TreePine`, `Activity`, `Sparkles`)
- [x] `vitest` & `@testing-library/react` — comprehensive frontend test runner
- [x] `oxlint` & `typescript` — linting and typecheck validation

### 3.2 `src/services/soundEngine.ts` — Web Audio capture & synthesis
- [x] `SoundEngine` class using native `AudioContext`
- [x] `requestMicPermission()` — requests user microphone permission, handles denials gracefully
- [x] `startMicRecording()` — live microphone capture using `ScriptProcessorNode` / `AudioWorkletNode`
- [x] `stopMicRecording()` — stops stream, resamples audio buffer to 16 kHz, converts to 16-bit signed PCM little-endian format, and exports Base64 payload
- [x] Pure audio math functions:
  - `resampleTo16k(audioBuffer, sourceRate)` — linear interpolation resampling
  - `floatTo16BitPCM(float32Array)` — clamp and encode Float32 [-1.0, 1.0] to Int16
  - `arrayBufferToBase64(buffer)` — zero-dependency binary to base64 encoding
- [x] Spoken prompt playback:
  - `speakPrompt(text, audioUrl, onEnd)`
  - Streams ElevenLabs audio when `audioUrl` is populated
  - Transparent fallback to browser `speechSynthesis` (Web Speech API) or visual whisper when `audioUrl` is empty

### 3.3 `src/services/api.ts` — HTTP client & on-device fallback
- [x] `ApiService.groundMe(audioB64, samples, sampleRate)`:
  - Submits payload to `POST /api/v1/ground`
  - Validates response contract (`prompt`, `audio_url`, `features`, `classification`, `provider_status`)
- [x] Resilient on-device fallback:
  - If backend server is unreachable or offline, computes acoustic features (RMS dB, zero-crossing rate) directly from raw Float32 microphone samples
  - Selects appropriate heuristic environment tag (`"forest"`, `"urban_park"`, `"indoor"`)
  - Generates context-appropriate grounding prompt on device
- [x] `ApiService.checkHealth()` — queries `GET /health` endpoint with timeout

### 3.4 Vitest Test Suite (`frontend/tests/`)
- [x] 13 unit tests covering:
  - Audio math (`floatTo16BitPCM`, `arrayBufferToBase64`, `resampleTo16k`)
  - Boundary conditions (silence, clipping prevention, length preservation)
  - API client live response mapping
  - API client offline fallback calculation

## Acceptance Criteria
- 16 kHz mono PCM audio recording executes cleanly in standard modern browsers
- All 13 Vitest tests pass (`npm test`)
- TypeScript typecheck passes with zero errors (`npm run typecheck`)
- Oxlint passes with zero warnings (`npm run lint`)
- On-device acoustic fallback triggers seamlessly if backend is offline
