import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';

/// A pill-shaped badge displaying the detected environment tag.
///
/// Appears briefly at the bottom of HomeScreen after a successful
/// grounding response, then fades out before the blackout transition.
///
/// Examples: "forest", "urban_park", "coastal", "meadow"
class SensoryBadge extends StatefulWidget {
  final String environmentTag;
  final bool visible;

  const SensoryBadge({
    super.key,
    required this.environmentTag,
    required this.visible,
  });

  @override
  State<SensoryBadge> createState() => _SensoryBadgeState();
}

class _SensoryBadgeState extends State<SensoryBadge>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeIn,
    );
  }

  @override
  void didUpdateWidget(SensoryBadge oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.visible && !oldWidget.visible) {
      _controller.forward();
    } else if (!widget.visible && oldWidget.visible) {
      _controller.reverse();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String get _displayLabel {
    return widget.environmentTag.replaceAll('_', ' ').toUpperCase();
  }

  IconData get _environmentIcon {
    return switch (widget.environmentTag) {
      'forest' => Icons.forest_rounded,
      'meadow' => Icons.grass_rounded,
      'coastal' => Icons.water_rounded,
      'urban_park' => Icons.park_rounded,
      'busy_street' => Icons.traffic_rounded,
      'indoor' => Icons.home_rounded,
      _ => Icons.nature_rounded,
    };
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.mossMuted,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: AppColors.herbal.withOpacity(0.4),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              _environmentIcon,
              color: AppColors.herbalLight,
              size: 14,
            ),
            const SizedBox(width: 8),
            Text(
              _displayLabel,
              style: AppTypography.textTheme.labelSmall?.copyWith(
                color: AppColors.herbalLight,
                letterSpacing: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
