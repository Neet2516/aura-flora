# Task 04 — React UI, Grounding State Machine & AMOLED Blackout

**Goal**: Build the minimalist anti-screen user interface, phone simulator, state machine hook, desktop bioacoustic dashboard, and AMOLED `#000000` blackout screen.

## Sub-tasks

### 4.1 `src/hooks/useGroundingSession.ts` — interaction lifecycle & state machine
- [x] Strict state machine flow:
  `idle` → `requestingPermission` → `recording` → `analyzing` → `speaking` → `blackout` → `error`
- [x] Strict ≤15-Second Screen Time Protocol:
  - 5-6s recording countdown
  - ~2s backend DSP / fallback inference
  - ~3.5s spoken prompt audio
  - Automatic blackout transition enforcing "Touch Grass" detox principle
- [x] Race condition prevention:
  - Unique session tokens (`sessionToken`) generated per grounding cycle
  - Drops stale asynchronous backend responses if user resets or initiates a new cycle
- [x] Guaranteed blackout transition timer (3.5s) preventing speech synthesis stalls

### 4.2 `src/components/MobileSimulator.tsx` — mobile anti-screen experience
- [x] Realistic mobile phone chassis with camera notch, dynamic island, and home bar
- [x] Single central action button with breathing pulse animation and countdown ring
- [x] AMOLED `#000000` Blackout Screen:
  - Zero background photons emitted (`#000000` terminal black)
  - Exit condition: strictly requires a double-tap (`handleDoubleTapToWake` / `onDoubleClick`)
  - No gamification, streaks, badges, or notification prompts

### 4.3 Desktop Dashboard & Bioacoustic Lab Components
- [x] `HeroGrid.tsx` — split desktop hero with live status badges, telemetry stats, and interactive preview
- [x] `ProductPreviewSection.tsx` — side-by-side protocol breakdown with the embedded interactive mobile simulator
- [x] `BioacousticLabSection.tsx` — desktop lab view with real-time frequency visualizer, DSP metrics (spectral centroid, biophony ratio, RMS dB, ZCR), and sample rate telemetry
- [x] `InstallationCtaSection.tsx` — PWA install action and offline support guide

## Acceptance Criteria
- Full interaction loop completes in ≤15 seconds from start to blackout
- AMOLED blackout screen displays pure `#000000` with zero ambient glow
- Double-tap wake gesture works reliably to restore simulator to idle state
- Desktop and mobile layouts render responsively with zero layout shifts
- All Vitest tests pass (`npm test`)
- TypeScript typecheck and oxlint pass cleanly
