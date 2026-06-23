import 'package:flutter/material.dart';
import 'features/auth/screens/login_screen.dart';
import 'core/screens/main_shell_screen.dart';
import 'core/constants/app_colors.dart';

class EventVaultApp extends StatelessWidget {
  const EventVaultApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EventVault Mobile Gateway',
      debugShowCheckedModeBanner: false,
      
      // Configuration for the application theme design system.
      // This establishes the cyber-vault palette across all native components.
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.scaffoldBackground,
        
        // This customizes the default color system parameters to match your styleguide.
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,        // Emerald Green Action Nodes
          surface: AppColors.cardBackground,        // Deep Slate 950 Card Containers
          onSurface: AppColors.textPrimary,      // Premium Off-White Text Elements
          outline: AppColors.border,        // Slate 800 Structuring Borders
        ),
        
        // Custom configurations for text rendering to preserve legibility on dark assets.
        textTheme: const TextTheme(
          headlineMedium: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
          bodyMedium: TextStyle(
            color: AppColors.textSecondary,          // Light Slate Muted Captions
          ),
        ),
        
        useMaterial3: true,
      ),
      
      // Application routing configuration
      routes: {
        '/': (context) => const LoginScreen(),
        '/main': (context) => const MainShellScreen(),
      },
      
      // Initial route for the application
      initialRoute: '/',
    );
  }
}