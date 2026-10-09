import 'dart:async';
import 'package:audioplayers/audioplayers.dart';

/// Service responsible for streaming and playing TTS audio from the backend.
///
/// Emits a completion event when playback finishes, which the state machine
/// uses to trigger the blackout screen transition.
class AudioPlayerService {
  final AudioPlayer _player = AudioPlayer();
  final StreamController<void> _completionController =
      StreamController<void>.broadcast();

  AudioPlayerService() {
    _player.onPlayerComplete.listen((_) {
      _completionController.add(null);
    });
  }

  /// Stream that emits when audio playback completes.
  ///
  /// The blackout screen subscribes to this to know when the voice has finished.
  Stream<void> get onPlaybackComplete => _completionController.stream;

  /// Start streaming and playing an MP3 from the given absolute URL.
  ///
  /// Uses [UrlSource] for direct streaming — no local file download needed.
  Future<void> playFromUrl(String url) async {
    await _player.stop(); // ensure no previous playback
    await _player.play(UrlSource(url));
  }

  /// Stop current playback.
  Future<void> stop() async {
    await _player.stop();
  }

  /// Release all player resources. Call in dispose().
  Future<void> dispose() async {
    await _player.stop();
    await _player.dispose();
    await _completionController.close();
  }
}
