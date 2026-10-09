import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// AuraFlora design system typography.
///
/// All text styles use Inter (Google Fonts) with AMOLED-optimized colors.
/// Only the sizes 12/14/16/20/24/32sp are permitted per the design spec.
abstract final class AppTypography {
  /// Base Inter text theme applied to the MaterialApp.
  static TextTheme get textTheme => GoogleFonts.interTextTheme(
        const TextTheme(
          // 32sp — App title / hero text
          displaySmall: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.w300,
            color: AppColors.sand,
            letterSpacing: -0.5,
          ),
          // 24sp — Section headers
          headlineMedium: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w400,
            color: AppColors.sand,
            letterSpacing: -0.3,
          ),
          // 20sp — App name / prominent labels
          titleLarge: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w500,
            color: AppColors.sand,
            letterSpacing: 0.15,
          ),
          // 16sp — Body text
          bodyLarge: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: AppColors.sand,
            letterSpacing: 0.1,
          ),
          // 14sp — Secondary body
          bodyMedium: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: AppColors.sandMuted,
            letterSpacing: 0.1,
          ),
          // 12sp — Captions, hints, badges
          bodySmall: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: AppColors.sandFaint,
            letterSpacing: 0.4,
          ),
          // 14sp — Labels (buttons, tags)
          labelLarge: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppColors.sand,
            letterSpacing: 0.5,
          ),
          labelSmall: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: AppColors.sandMuted,
            letterSpacing: 0.5,
          ),
        ),
      );

  // ── Specific styles ───────────────────────────────────────────────────────

  /// App name "AuraFlora" header style
  static TextStyle get appName => GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        color: AppColors.sand,
        letterSpacing: 2.0,
      );

  /// Tagline "Press. Listen. Go." style
  static TextStyle get tagline => GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w300,
        color: AppColors.sandFaint,
        letterSpacing: 3.0,
      );

  /// Blackout screen hint text (10% opacity applied by widget)
  static TextStyle get blackoutHint => GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w300,
        color: Colors.white,
        letterSpacing: 0.5,
      );

  /// Blackout sub-hint (8% opacity applied by widget)
  static TextStyle get blackoutSubHint => GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w300,
        color: Colors.white,
        letterSpacing: 0.5,
      );

  /// Grounding prompt text shown briefly before blackout
  static TextStyle get groundingPrompt => GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: AppColors.sand,
        letterSpacing: 0.2,
        height: 1.5,
      );
}
