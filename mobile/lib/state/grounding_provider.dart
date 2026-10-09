import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_client.dart';
import '../services/audio_recorder_service.dart';
import '../core/constants/app_constants.dart';

/// Represents the lifecycle state of a grounding session.
enum GroundingStatus {
  /// App is idle, waiting for user to initiate.
  idle,

  /// Microphone is actively recording ambient audio.
  recording,

  /// Audio sent to backend; awaiting AI pipeline response.
  processing,

  /// Response received; preparing to navigate to blackout.
  readyForBlackout,

  /// An error occurred — displayed briefly then auto-dismissed.
  error,
}

/// Complete state of the grounding session.
class GroundingState {
  final GroundingStatus status;
  final GroundResponse? lastResponse;
  final String? errorMessage;
  final Duration? recordingDuration;

  const GroundingState({
    this.status = GroundingStatus.idle,
    this.lastResponse,
    this.errorMessage,
    this.recordingDuration,
  });

  GroundingState copyWith({
    GroundingStatus? status,
    GroundResponse? lastResponse,
    String? errorMessage,
    Duration? recordingDuration,
  }) =>
      GroundingState(
        status: status ?? this.status,
        lastResponse: lastResponse ?? this.lastResponse,
        errorMessage: errorMessage ?? this.errorMessage,
        recordingDuration: recordingDuration ?? this.recordingDuration,
      );

  /// True if the user should not be able to interact with the record button.
  bool get isInteractionLocked =>
      status == GroundingStatus.recording ||
      status == GroundingStatus.processing ||
      status == GroundingStatus.readyForBlackout;
}

/// Business logic state machine for the grounding session.
///
/// Orchestrates: recording → API call → navigation signal.
/// Delegates all I/O to injected services.
class GroundingNotifier extends StateNotifier<GroundingState> {
  final AudioRecorderService _recorder;
  final ApiClient _apiClient;
  Timer? _recordingTimer;
  Timer? _errorDismissTimer;
  DateTime? _recordingStart;

  GroundingNotifier({
    required AudioRecorderService recorder,
    required ApiClient apiClient,
  })  : _recorder = recorder,
        _apiClient = apiClient,
        super(const GroundingState());

  /// Initiate the full grounding pipeline.
  ///
  /// Flow: request mic permission → record → stop → POST to backend → signal blackout.
  Future<void> startGrounding() async {
    if (state.isInteractionLocked) return;

    // ── Phase 1: Start recording ───────────────────────────────────────────
    try {
      await _recorder.startRecording();
      _recordingStart = DateTime.now();

      state = state.copyWith(status: GroundingStatus.recording);

      // Auto-stop after max duration
      _recordingTimer = Timer(
        const Duration(milliseconds: AppConstants.maxRecordingMs),
        _stopAndProcess,
      );
    } catch (e) {
      _setError(e.toString());
      return;
    }
  }

  /// Manually stop recording early (user taps record button again).
  Future<void> stopRecordingEarly() async {
    if (state.status != GroundingStatus.recording) return;
    _recordingTimer?.cancel();

    final elapsed = _recordingStart != null
        ? DateTime.now().difference(_recordingStart!)
        : const Duration(seconds: 5);

    if (elapsed.inMilliseconds < AppConstants.minRecordingMs) {
      // Too short — continue recording until minimum
      await Future.delayed(
        Duration(
            milliseconds:
                AppConstants.minRecordingMs - elapsed.inMilliseconds),
      );
    }

    await _stopAndProcess();
  }

  Future<void> _stopAndProcess() async {
    _recordingTimer?.cancel();

    // ── Phase 2: Stop recording, get audio bytes ───────────────────────────
    final audioBytes = await _recorder.stopRecording();

    // ── Phase 3: Send to backend ───────────────────────────────────────────
    state = state.copyWith(status: GroundingStatus.processing);

    try {
      final response = await _apiClient.groundMe(audioBytes);

      state = state.copyWith(
        status: GroundingStatus.readyForBlackout,
        lastResponse: response,
      );
    } catch (e) {
      _setError('Could not reach the forest. Try again outside.');
    }
  }

  /// Reset to idle after navigation to blackout screen completes.
  void acknowledgeBlackout() {
    state = const GroundingState(status: GroundingStatus.idle);
  }

  /// Reset to idle from error state.
  void clearError() {
    state = const GroundingState(status: GroundingStatus.idle);
  }

  void _setError(String message) {
    state = state.copyWith(
      status: GroundingStatus.error,
      errorMessage: message,
    );

    _errorDismissTimer?.cancel();
    _errorDismissTimer = Timer(
      const Duration(milliseconds: AppConstants.errorDismissMs),
      clearError,
    );
  }

  @override
  void dispose() {
    _recordingTimer?.cancel();
    _errorDismissTimer?.cancel();
    _recorder.dispose();
    super.dispose();
  }
}

// ── Riverpod Providers ────────────────────────────────────────────────────────

/// Provider for the AudioRecorderService singleton.
final audioRecorderProvider = Provider<AudioRecorderService>(
  (ref) => AudioRecorderService(),
);

/// Provider for the ApiClient singleton.
final apiClientProvider = Provider<ApiClient>(
  (ref) => ApiClient(),
);

/// Provider for the GroundingNotifier state machine.
final groundingProvider =
    StateNotifierProvider<GroundingNotifier, GroundingState>(
  (ref) => GroundingNotifier(
    recorder: ref.watch(audioRecorderProvider),
    apiClient: ref.watch(apiClientProvider),
  ),
);
