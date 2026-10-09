import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/constants/app_constants.dart';
import '../../state/grounding_provider.dart';
import '../widgets/pulse_listener.dart';
import '../widgets/sensory_badge.dart';
import 'blackout_screen.dart';

/// The primary screen of AuraFlora.
///
/// Single-button interface: tap to record ambient audio, then auto-transitions
/// to [BlackoutScreen] once the grounding prompt is ready.
///
/// Design: AMOLED deep forest background, single pulse record button,
/// minimal typography. No scrolling, no feeds, no navigation.
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  bool _badgeVisible = false;
  bool _hasNavigated = false;

  @override
  Widget build(BuildContext context) {
    final groundingState = ref.watch(groundingProvider);
    final notifier = ref.read(groundingProvider.notifier);

    // React to readyForBlackout state — navigate exactly once
    ref.listen<GroundingState>(groundingProvider, (previous, next) {
      if (next.status == GroundingStatus.readyForBlackout &&
          !_hasNavigated &&
          next.lastResponse != null) {
        _hasNavigated = true;

        // Show badge briefly then navigate
        setState(() => _badgeVisible = true);

        Future.delayed(
          const Duration(milliseconds: AppConstants.sensoryBadgeDisplayMs),
          () {
            if (!mounted) return;
            setState(() => _badgeVisible = false);

            Navigator.of(context)
                .push(
              PageRouteBuilder(
                pageBuilder: (_, animation, __) => BlackoutScreen(
                  response: next.lastResponse!,
                ),
                transitionsBuilder: (_, animation, __, child) {
                  return FadeTransition(
                    opacity: animation,
                    child: child,
                  );
                },
                transitionDuration: const Duration(
                  milliseconds: AppConstants.blackoutFadeDurationMs,
                ),
              ),
            )
                .then((_) {
              // Reset state machine when user exits blackout
              notifier.acknowledgeBlackout();
              _hasNavigated = false;
            });
          },
        );
      }

      // Reset navigation flag when returning to idle
      if (next.status == GroundingStatus.idle && previous?.status != GroundingStatus.idle) {
        _hasNavigated = false;
      }
    });

    return Scaffold(
      backgroundColor: AppColors.forestDeep,
      body: SafeArea(
        child: Stack(
          children: [
            // Main content column
            Column(
              children: [
                // ── Header ────────────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.only(top: 48),
                  child: Column(
                    children: [
                      Text(
                        'AURAFLORA',
                        style: AppTypography.appName,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'PRESS · LISTEN · GO',
                        style: AppTypography.tagline,
                      ),
                    ],
                  ),
                ),

                // ── Spacer + Pulse Button ─────────────────────────────────
                Expanded(
                  child: Center(
                    child: _buildRecordButton(groundingState, notifier),
                  ),
                ),

                // ── Status label ──────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildStatusLabel(groundingState),
                ),

                // ── Sensory Badge ─────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.only(bottom: 48),
                  child: SensoryBadge(
                    environmentTag:
                        groundingState.lastResponse?.classification
                            .environmentTag ??
                            'unknown',
                    visible: _badgeVisible,
                  ),
                ),
              ],
            ),

            // ── Error overlay ─────────────────────────────────────────────
            if (groundingState.status == GroundingStatus.error &&
                groundingState.errorMessage != null)
              _buildErrorOverlay(groundingState.errorMessage!),
          ],
        ),
      ),
    );
  }

  Widget _buildRecordButton(
    GroundingState state,
    GroundingNotifier notifier,
  ) {
    final isRecording = state.status == GroundingStatus.recording;
    final isDisabled = state.isInteractionLocked &&
        state.status != GroundingStatus.recording;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        PulseListener(
          isRecording: isRecording,
          isDisabled: isDisabled,
          onTap: () {
            if (isRecording) {
              notifier.stopRecordingEarly();
            } else {
              notifier.startGrounding();
            }
          },
          child: Icon(
            isRecording ? Icons.stop_rounded : Icons.mic_rounded,
            color: AppColors.sand,
            size: 44,
          ),
        ),
        const SizedBox(height: 20),
        if (state.status == GroundingStatus.processing)
          _buildProcessingIndicator(),
      ],
    );
  }

  Widget _buildProcessingIndicator() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 12,
          height: 12,
          child: CircularProgressIndicator(
            strokeWidth: 1.5,
            valueColor: AlwaysStoppedAnimation<Color>(
              AppColors.herbalLight.withValues(alpha: 0.6),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Text(
          'reading the air',
          style: AppTypography.textTheme.bodySmall?.copyWith(
            color: AppColors.sandFaint,
            letterSpacing: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusLabel(GroundingState state) {
    final label = switch (state.status) {
      GroundingStatus.idle => '',
      GroundingStatus.recording => 'listening...',
      GroundingStatus.processing => '',
      GroundingStatus.readyForBlackout => 'grounded.',
      GroundingStatus.error => '',
    };

    return AnimatedOpacity(
      opacity: label.isEmpty ? 0.0 : 1.0,
      duration: const Duration(milliseconds: 300),
      child: Text(
        label,
        style: AppTypography.textTheme.bodySmall?.copyWith(
          letterSpacing: 2.0,
          color: AppColors.herbalLight.withValues(alpha: 0.7),
        ),
      ),
    );
  }

  Widget _buildErrorOverlay(String message) {
    return Positioned(
      bottom: 120,
      left: 24,
      right: 24,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.mossMuted,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: AppColors.errorMuted.withValues(alpha: 0.4),
            width: 1,
          ),
        ),
        child: Text(
          message,
          textAlign: TextAlign.center,
          style: AppTypography.textTheme.bodySmall?.copyWith(
            color: AppColors.sand.withValues(alpha: 0.8),
          ),
        ),
      ),
    );
  }
}
