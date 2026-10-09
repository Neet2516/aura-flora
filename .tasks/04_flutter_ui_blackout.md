# Task 04 — Flutter UI & Blackout Screen

**Goal**: Build the ultra-minimal two-screen app with breathing pulse animation and AMOLED blackout.

## Sub-tasks

### 4.1 `lib/core/theme/app_colors.dart`
- [x] `AppColors` abstract class with all color constants
- [x] `forestDeep`, `mossMuted`, `herbal`, `sand`, `blackout` defined as `Color` constants

### 4.2 `lib/core/theme/app_typography.dart`
- [x] `AppTypography` with Inter-based TextTheme
- [x] Defined sizes: 12/14/16/20/24/32sp

### 4.3 `lib/presentation/screens/home_screen.dart`
- [x] Full AMOLED dark background `#0A0F0D`
- [x] Single centered record button with `PulseListener` widget
- [x] App name "AuraFlora" in sand color, 20sp, top
- [x] Tagline: "Press. Listen. Go." in 12sp muted
- [x] State-driven: idle → recording → processing → navigating
- [x] Recording state shows live waveform ripple
- [x] Error state shows brief sand-colored error text (3s auto-dismiss)

### 4.4 `lib/presentation/widgets/pulse_listener.dart`
- [x] Breathing scale animation: 0.97 ↔ 1.03, 3-second period, `Curves.easeInOut`
- [x] Idle: soft herbal `#4E8752` glow
- [x] Recording: faster pulse (1.5s period), brighter glow
- [x] Container: 120×120 circular button

### 4.5 `lib/presentation/widgets/sensory_badge.dart`
- [x] Small pill-shaped badge showing `environment_tag` from API response
- [x] Appears briefly at bottom of home screen before blackout transition
- [x] Auto-dismissed after 2 seconds

### 4.6 `lib/presentation/screens/blackout_screen.dart`
- [x] Background: pure `#000000`
- [x] Hint text: "Screen locked. Look up." at 10% opacity (white, 14sp, centered)
- [x] "Double-tap to exit" at 8% opacity below
- [x] `GestureDetector` with `onDoubleTap` → `Navigator.pop()`
- [x] `WakelockPlus.enable()` on enter, `WakelockPlus.disable()` on exit
- [x] Audio player started immediately on screen entry via `WidgetsBinding.addPostFrameCallback`
- [x] Fade-in: 800ms linear black overlay from home screen

### 4.7 `lib/state/grounding_provider.dart`
- [x] `GroundingState` enum: `idle`, `recording`, `processing`, `playingBlackout`, `error`
- [x] `GroundingNotifier extends StateNotifier<GroundingState>`
- [x] `startGrounding()`: record → API call → navigate to blackout
- [x] Holds `GroundResponse? lastResponse` for passing to blackout screen

## Acceptance Criteria
- HomeScreen renders correctly on Android dark mode
- PulseListener animates at both speeds
- BlackoutScreen is pure black, hint barely visible
- Double-tap exits blackout correctly
- `flutter test` widget tests pass
