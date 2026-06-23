import 'package:flutter/material.dart';

/// AppColors - Centralized color scheme for EventVault mobile application
/// This class maintains consistency across all screens and components
/// following the established dark theme with emerald accent colors
class AppColors {
  // Private constructor to prevent instantiation
  AppColors._();

  // Primary Background Colors
  static const Color scaffoldBackground = Color(0xFF0F172A); // Slate 900 - Main app background
  static const Color cardBackground = Color(0xFF020617); // Slate 950 - Card/surface background
  static const Color inputBackground = Color(0xFF0F172A); // Slate 900 - Input field background

  // Primary Action Colors
  static const Color primary = Color(0xFF10B981); // Emerald 500 - Primary buttons and actions
  static const Color primaryLight = Color(0xFF34D399); // Emerald 400 - Lighter accent
  static const Color primaryDark = Color(0xFF059669); // Emerald 600 - Darker accent

  // Text Colors
  static const Color textPrimary = Color(0xFFF1F5F9); // Off-white - Primary text
  static const Color textSecondary = Color(0xFF94A3B8); // Light slate - Secondary text
  static const Color textTertiary = Color(0xFF64748B); // Darker slate - Tertiary text
  static const Color textHint = Color(0xFF64748B); // Slate 500 - Hint text

  // Border and Divider Colors
  static const Color border = Color(0xFF1E293B); // Slate 800 - Borders and dividers
  static const Color borderLight = Color(0xFF334155); // Slate 700 - Lighter borders

  // Status Colors
  static const Color success = Color(0xFF10B981); // Emerald 500 - Success states
  static const Color error = Color(0xFFEF4444); // Red 500 - Error states
  static const Color warning = Color(0xFFF59E0B); // Amber 500 - Warning states

  // Overlay Colors
  static const Color overlay = Color(0x80000000); // Semi-transparent black overlay
  static const Color scrim = Color(0x66000000); // Scrim for modals

  // Icon Colors
  static const Color iconPrimary = Color(0xFFF1F5F9); // Primary icons
  static const Color iconSecondary = Color(0xFF94A3B8); // Secondary icons
  static const Color iconActive = Color(0xFF34D399); // Active state icons
}