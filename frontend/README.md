# AuraFlora Frontend

React 19 + TypeScript + Vite Progressive Web Application (PWA) delivering the AuraFlora anti-screen grounding experience and mobile simulator.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8 + `vite-plugin-pwa`
- **Linter & Test**: `oxlint` + `vitest`
- **Audio & Animations**: Web Audio API (16 kHz PCM microphone capture, FFT analyser node), Framer Motion, GSAP, Lucide React

## Directory Structure

```text
frontend/
├── src/
│   ├── components/         # MobileSimulator, AudioVisualizer, BlackoutScreen, etc.
│   ├── hooks/              # useGroundingSession (centralized interaction lifecycle)
│   ├── services/
│   │   ├── soundEngine.ts  # Web Audio API engine, 16 kHz resampler, PCM encoder
│   │   ├── api.ts          # Backend API client with real on-device fallback
│   │   ├── apiKeys.ts      # Custom client API key management
│   │   └── __tests__/      # Vitest unit test suites
│   ├── constants/          # Acoustic presets and design tokens
│   ├── types.ts            # Strongly typed telemetry & classification models
│   ├── App.tsx             # Main application layout and interactive preview
│   └── main.tsx            # PWA entrypoint
├── public/                 # Static assets, Web App Manifest, icons
├── package.json
└── vite.config.ts
```

## Running & Verification

```bash
# Typecheck
npm run typecheck

# Lint with oxlint
npm run lint

# Run unit tests
npm test

# Build production bundle
npm run build

# Start local dev server
npm run dev
```

## Anti-Screen Invariants

- **≤ 15s Total Budget**: Keep audio capture, classification, and spoken whisper under 15 seconds.
- **Terminal Blackout**: The blackout screen is AMOLED pure `#000000`. Double-tap anywhere to wake.
