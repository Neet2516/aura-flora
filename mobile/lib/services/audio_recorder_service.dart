import 'dart:typed_data';
import 'package:permission_handler/permission_handler.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import '../core/constants/app_constants.dart';

/// Exception thrown when microphone permission is denied.
class MicPermissionDeniedException implements Exception {
  const MicPermissionDeniedException();

  @override
  String toString() =>
      'Microphone permission denied. Please enable it in system settings.';
}

/// Service responsible for capturing raw ambient audio from the microphone.
///
/// Records in WAV format at 16 kHz mono — matches backend DSP expectations.
/// All file I/O is self-cleaning: temp WAV is deleted after bytes are read.
class AudioRecorderService {
  final AudioRecorder _recorder = AudioRecorder();
  String? _tempFilePath;

  /// Request microphone permission and start recording.
  ///
  /// Throws [MicPermissionDeniedException] if permission is denied.
  Future<void> startRecording() async {
    // Request microphone permission
    final status = await Permission.microphone.request();
    if (!status.isGranted) {
      throw const MicPermissionDeniedException();
    }

    // Create a unique temp file for this recording
    final tempDir = await getTemporaryDirectory();
    _tempFilePath =
        '${tempDir.path}/aura_flora_rec_${DateTime.now().millisecondsSinceEpoch}.wav';

    await _recorder.start(
      const RecordConfig(
        encoder: AudioEncoder.wav,
        sampleRate: AppConstants.recordSampleRate,
        numChannels: 1,        // mono
        bitRate: 256000,
      ),
      path: _tempFilePath!,
    );
  }

  /// Stop recording and return the captured audio as raw bytes.
  ///
  /// Automatically deletes the temp file after reading.
  ///
  /// Returns [Uint8List] of WAV file bytes (including WAV header).
  Future<Uint8List> stopRecording() async {
    final path = await _recorder.stop();

    if (path == null || path.isEmpty) {
      throw StateError('Recording produced no output file.');
    }

    final file = File(path);
    final bytes = await file.readAsBytes();

    // Clean up temp file
    try {
      await file.delete();
    } catch (_) {
      // Non-fatal — temp files are cleaned by OS eventually
    }
    _tempFilePath = null;

    return bytes;
  }

  /// Whether recording is currently active.
  Future<bool> get isRecording => _recorder.isRecording();

  /// Release resources. Call in dispose().
  Future<void> dispose() async {
    if (await _recorder.isRecording()) {
      await _recorder.stop();
    }
    _recorder.dispose();
  }
}
