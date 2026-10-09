# Task 03 — Flutter Audio Core

**Goal**: Implement microphone recording, audio playback pipeline, and backend API client.

## Sub-tasks

### 3.1 `pubspec.yaml` — dependencies
- [x] `record: ^5.1.0` — cross-platform microphone recording
- [x] `audioplayers: ^6.0.0` — MP3 playback
- [x] `flutter_riverpod: ^2.5.1` — state management
- [x] `dio: ^5.4.3` — HTTP client with multipart/form support
- [x] `wakelock_plus: ^1.2.0` — prevent screen sleep during blackout
- [x] `google_fonts: ^6.2.1` — Inter typography
- [x] `path_provider: ^2.1.3` — temp file paths for recorded audio

### 3.2 `lib/services/audio_recorder_service.dart`
- [x] `AudioRecorderService` class using `record` package
- [x] `startRecording() async` — creates temp WAV file, starts mic capture at 16 kHz mono
- [x] `stopRecording() async → Uint8List` — stops capture, reads bytes, deletes temp file
- [x] Permission handling: request mic permission on first call, throw `MicPermissionDeniedException` if rejected
- [x] Duration guard: minimum 3s, maximum 10s recording enforced

### 3.3 `lib/services/audio_player_service.dart`
- [x] `AudioPlayerService` wrapping `AudioPlayer`
- [x] `playFromUrl(String url) async` — streams audio from backend URL
- [x] `onPlaybackComplete` stream — emits event when audio finishes (triggers blackout)
- [x] `dispose()` — clean up player resources

### 3.4 `lib/services/api_client.dart`
- [x] `ApiClient` using `Dio`
- [x] `groundMe(Uint8List audioBytes) async → GroundResponse` — base64 encodes audio, POST to `/api/v1/ground`
- [x] `GroundResponse` model: `prompt`, `audioUrl`, `features` (typed Dart class with `fromJson`)
- [x] Timeout: 15 seconds; retry: 0 (fail fast — no retry loops that waste time)
- [x] Error: throw `ApiException` with human-readable message

## Acceptance Criteria
- Recording starts/stops cleanly on Android emulator
- Audio plays from backend URL after successful API call
- `flutter analyze` clean
