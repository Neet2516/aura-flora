# Task 03 — React Web Audio Core & Acoustic Processing

**Goal**: Implement native Web Audio API 16 kHz microphone recording, PCM sample conversion, audio analysis, and Rust backend API integration.

## Sub-tasks

### 3.1 `frontend/package.json` — dependencies
- [x] React 19 + TypeScript 5+ + Vite 8
- [x] `vite-plugin-pwa` — Progressive Web App service worker and offline manifests
- [x] `framer-motion` & `gsap` — micro-animations and smooth layout transitions
- [x] `lucide-react` — minimalist icons (Mic, Volume2, TreePine, etc.)
- [x] `vitest` & `oxlint` — fast unit testing and linting

### 3.2 `src/services/soundEngine.ts`
- [x] `SoundEngine` class using native `AudioContext`
- [x] `requestMicPermission()` — requests microphone access, handles permissions
- [x] `startMicRecording()` — 16 kHz mono microphone capture using ScriptProcessor/AudioWorklet
- [x] `stopMicRecording()` — resamples to 16 kHz, encodes to 16-bit signed PCM little-endian, exports Base64
- [x] Pure utility functions: `resampleTo16k`, `floatTo16BitPCM`, `arrayBufferToBase64`
- [x] Spoken prompt playback: `speakPrompt(text, audioUrl, onEnd)` with browser speech synthesis fallback

### 3.3 `src/services/api.ts`
- [x] `ApiService.groundMe(audioB64, samples, preset)` — submits audio payload to POST `/api/v1/ground`
- [x] On-device acoustic fallback: if backend is unreachable, computes RMS dB and ZCR on real captured Float32 samples
- [x] `ApiService.checkHealth()` — GET `/health` endpoint status check

## Acceptance Criteria
- 16 kHz mono PCM audio recording executes cleanly in browser
- Pure audio math functions covered by Vitest tests (`resampleTo16k`, `floatTo16BitPCM`, `arrayBufferToBase64`)
- Clean fallback to on-device audio calculation when remote backend is offline
