import 'package:flutter/material.dart';

/// AuraFlora design system color tokens.
///
/// All colors are AMOLED-optimized. Never use raw hex strings
/// outside of this class — always reference these constants.
abstract final class AppColors {
  // ── Primary Backgrounds ──────────────────────────────────────────────────
  
  /// Primary app background. Deep forest black. AMOLED-safe.
  static const Color forestDeep = Color(0xFF0A0F0D);

  /// Surface / card background. Muted moss green.
  static const Color mossMuted = Color(0xFF1F2E23);

  // ── Accent ───────────────────────────────────────────────────────────────

  /// Primary accent. Herbal green — used for CTAs and record button.
  static const Color herbal = Color(0xFF4E8752);

  /// Lighter herbal variant for glows and highlights.
  static const Color herbalLight = Color(0xFF81C784);

  /// Deep herbal for pressed states.
  static const Color herbalDark = Color(0xFF2E5E35);

  // ── Text & Icons ─────────────────────────────────────────────────────────

  /// Primary text and icon color. Warm sand — easy on the eyes.
  static const Color sand = Color(0xFFE8DFD8);

  /// Secondary text. Muted sand.
  static const Color sandMuted = Color(0xFF9E9590);

  /// Tertiary text. Barely visible sand.
  static const Color sandFaint = Color(0xFF5A5652);

  // ── Special ──────────────────────────────────────────────────────────────

  /// Pure AMOLED blackout. Used for the blackout screen.
  static const Color blackout = Color(0xFF000000);

  /// Error state (subtle, not alarming — no bright red).
  static const Color errorMuted = Color(0xFF8B4A4A);

  // ── Transparency helpers ──────────────────────────────────────────────────

  /// 10% opacity white — for barely-visible blackout hints.
  static const Color hintWhite = Color(0x1AFFFFFF);

  /// 8% opacity white — for sub-hints.
  static const Color hintWhiteFaint = Color(0x14FFFFFF);

  /// Herbal glow for pulse animation (30% opacity).
  static const Color herbalGlow = Color(0x4D4E8752);
}
