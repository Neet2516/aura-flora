import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/constants/app_constants.dart';

/// Minimalist breathing pulse animation wrapping the record button.
///
/// In idle mode: slow, calm inhale/exhale scale oscillation (3s period).
/// In recording mode: faster pulse (1.5s period) with brighter glow.
///
/// Design spec: scale 0.97 ↔ 1.03, easeInOut curve, herbal green glow.
class PulseListener extends StatefulWidget {
  /// Whether the device is actively recording.
  final bool isRecording;

  /// Whether the button is disabled (processing/transitioning).
  final bool isDisabled;

  /// Child widget to animate (the record button content).
  final Widget child;

  /// Called when the user taps the button.
  final VoidCallback? onTap;

  const PulseListener({
    super.key,
    required this.isRecording,
    required this.isDisabled,
    required this.child,
    this.onTap,
  });

  @override
  State<PulseListener> createState() => _PulseListenerState();
}

class _PulseListenerState extends State<PulseListener>
    with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late AnimationController _glowController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    _initAnimations();
  }

  void _initAnimations() {
    _scaleController = AnimationController(
      duration: Duration(
        milliseconds: widget.isRecording
            ? AppConstants.recordingPulsePeriodMs
            : AppConstants.idlePulsePeriodMs,
      ),
      vsync: this,
    )..repeat(reverse: true);

    _glowController = AnimationController(
      duration: Duration(
        milliseconds: widget.isRecording
            ? AppConstants.recordingPulsePeriodMs
            : AppConstants.idlePulsePeriodMs,
      ),
      vsync: this,
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 0.97, end: 1.03).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.easeInOut),
    );

    _glowAnimation = Tween<double>(begin: 0.3, end: widget.isRecording ? 0.9 : 0.5).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );
  }

  @override
  void didUpdateWidget(PulseListener oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.isRecording != widget.isRecording) {
      final newDuration = Duration(
        milliseconds: widget.isRecording
            ? AppConstants.recordingPulsePeriodMs
            : AppConstants.idlePulsePeriodMs,
      );
      _scaleController.duration = newDuration;
      _glowController.duration = newDuration;

      _glowAnimation = Tween<double>(
        begin: 0.3,
        end: widget.isRecording ? 0.9 : 0.5,
      ).animate(
        CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
      );
    }
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.isDisabled ? null : widget.onTap,
      child: AnimatedBuilder(
        animation: Listenable.merge([_scaleAnimation, _glowAnimation]),
        builder: (context, child) {
          return Transform.scale(
            scale: widget.isDisabled ? 1.0 : _scaleAnimation.value,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: widget.isDisabled
                    ? AppColors.mossMuted
                    : AppColors.herbal,
                boxShadow: widget.isDisabled
                    ? null
                    : [
                        BoxShadow(
                          color: AppColors.herbal.withValues(
                            alpha: _glowAnimation.value,
                          ),
                          blurRadius: widget.isRecording ? 40 : 24,
                          spreadRadius: widget.isRecording ? 8 : 4,
                        ),
                      ],
              ),
              child: child,
            ),
          );
        },
        child: widget.child,
      ),
    );
  }
}
