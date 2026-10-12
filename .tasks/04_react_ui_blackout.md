# Task 04 — React UI, Grounding State Machine & AMOLED Blackout

**Goal**: Build the minimalist anti-screen user interface, phone simulator, state machine hook, and AMOLED `#000000` blackout screen.

## Sub-tasks

### 4.1 `src/hooks/useGroundingSession.ts`
- [x] Unified state machine: `idle` → `requestingPermission` → `recording` → `analyzing` → `speaking` → `blackout` → `error`
- [x] Countdown timer (5-6s) strictly enforcing ≤15s screen time protocol
- [x] Cancellation tokens / session IDs dropping stale asynchronous responses
- [x] Guaranteed blackout transition timer (3.5s) preventing speech synthesis stalls

### 4.2 `src/components/MobileSimulator.tsx`
- [x] Realistic mobile device chassis with camera notch and home indicator
- [x] Single centered record button with breathing pulse animation
- [x] Pure AMOLED `#000000` blackout lock with double-tap wake gesture (`handleDoubleTapToWake`)

### 4.3 `src/components/ProductPreviewSection.tsx`
- [x] Desktop two-column layout: Stage 01–03 protocol specifications + interactive simulator
- [x] Real-time audio frequency visualizer fed by `AnalyserNode`
- [x] Biophony score classification display and Gemma AI grounding whisper

## Acceptance Criteria
- Clean state transitions adhering to the ≤15-second total screen time budget
- Terminal AMOLED blackout screen powered down to `#000000`
- Double-tap or double-click dismisses blackout cleanly
- Zero console warnings or memory leaks on unmount
