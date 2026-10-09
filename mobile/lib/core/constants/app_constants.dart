/// AuraFlora application-wide constants.
abstract final class AppConstants {
  // ── Backend API ────────────────────────────────────────────────────────────

  /// Default backend URL (change to your deployed Render URL in production).
  static const String backendBaseUrl = String.fromEnvironment(
    'BACKEND_URL',
    defaultValue: 'http://10.0.2.2:8080', // Android emulator → localhost
  );

  static const String groundEndpoint = '/api/v1/ground';

  // ── Audio Recording ────────────────────────────────────────────────────────

  /// Sample rate for microphone capture (must match backend expectation).
  static const int recordSampleRate = 16000;

  /// Minimum recording duration in milliseconds.
  static const int minRecordingMs = 3000;

  /// Maximum recording duration in milliseconds.
  static const int maxRecordingMs = 10000;

  // ── UI Timing ─────────────────────────────────────────────────────────────

  /// Blackout fade-in duration (ms).
  static const int blackoutFadeDurationMs = 800;

  /// Sensory badge display duration before blackout transition (ms).
  static const int sensoryBadgeDisplayMs = 2000;

  /// Error message auto-dismiss duration (ms).
  static const int errorDismissMs = 3000;

  /// API request timeout (ms) — fail fast, no retry loops.
  static const int apiTimeoutMs = 15000;

  // ── Animation ─────────────────────────────────────────────────────────────

  /// Idle pulse period (ms).
  static const int idlePulsePeriodMs = 3000;

  /// Recording pulse period (ms) — faster to signal active capture.
  static const int recordingPulsePeriodMs = 1500;
}
