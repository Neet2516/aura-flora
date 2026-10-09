import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/constants/app_constants.dart';
import '../../services/api_client.dart';
import '../../services/audio_player_service.dart';

/// The blackout screen — pure #000000 AMOLED canvas.
///
/// Entered automatically after the grounding pipeline completes.
/// Audio begins playing immediately on enter.
/// Barely-visible hints at 10% and 8% opacity guide the user.
/// Exit: double-tap gesture ONLY. No back button. No visible controls.
class BlackoutScreen extends StatefulWidget {
  final GroundResponse response;

  const BlackoutScreen({
    super.key,
    required this.response,
  });

  @override
  State<BlackoutScreen> createState() => _BlackoutScreenState();
}

class _BlackoutScreenState extends State<BlackoutScreen>
    with SingleTickerProviderStateMixin {
  final AudioPlayerService _player = AudioPlayerService();
  late AnimationController _fadeController;
  late Animation<double> _hintFadeAnimation;
  bool _isAudioComplete = false;

  @override
  void initState() {
    super.initState();

    // Keep screen on — user is in the physical world, not looking at screen
    WakelockPlus.enable();

    // Force portrait to prevent accidental rotation during blackout
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
    ]);

    // Hint fades in after 1.5 seconds (give user a moment to adjust)
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _hintFadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    );

    // Start audio and hint fade after first frame renders
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startAudio();
      Future.delayed(const Duration(milliseconds: 1500), () {
        if (mounted) _fadeController.forward();
      });
    });
  }

  Future<void> _startAudio() async {
    final baseUrl = AppConstants.backendBaseUrl;
    final absoluteUrl = widget.response.absoluteAudioUrl(baseUrl);

    try {
      await _player.playFromUrl(absoluteUrl);

      // Listen for completion
      _player.onPlaybackComplete.listen((_) {
        if (mounted) {
          setState(() => _isAudioComplete = true);
        }
      });
    } catch (_) {
      // Audio failure is non-blocking — blackout continues without sound
    }
  }

  void _exitBlackout() {
    WakelockPlus.disable();
    SystemChrome.setPreferredOrientations(DeviceOrientation.values);
    Navigator.of(context).pop();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _player.dispose();
    WakelockPlus.disable();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.blackout,
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onDoubleTap: _exitBlackout,
        child: SizedBox.expand(
          child: FadeTransition(
            opacity: _hintFadeAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // ── Primary hint ──────────────────────────────────────────
                Opacity(
                  opacity: 0.10,
                  child: Text(
                    'Screen locked. Look up.',
                    textAlign: TextAlign.center,
                    style: AppTypography.blackoutHint,
                  ),
                ),

                const SizedBox(height: 12),

                // ── Sub-hint ──────────────────────────────────────────────
                Opacity(
                  opacity: 0.08,
                  child: Text(
                    'Double-tap to exit',
                    textAlign: TextAlign.center,
                    style: AppTypography.blackoutSubHint,
                  ),
                ),

                // ── Audio complete indicator (barely visible) ─────────────
                if (_isAudioComplete) ...[
                  const SizedBox(height: 48),
                  Opacity(
                    opacity: 0.05,
                    child: Text(
                      '·',
                      style: AppTypography.blackoutSubHint.copyWith(
                        fontSize: 24,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
