import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../widgets/app_top_bar.dart';
import '../widgets/app_sidebar.dart';
import '../../features/events/screens/event_explorer_screen.dart';
import '../../features/tickets/screens/ticket_wallet_screen.dart';
import '../../features/scanning/screens/camera_scanner_screen.dart';
import '../../features/scanning/screens/scan_history_screen.dart';
import '../../features/scanning/screens/agent_home_screen.dart';
import '../../features/settings/screens/settings_screen.dart';

/// MainShellScreen - Master shell/dashboard view wrapper
/// This widget manages the current route state and uses the AppSidebar to change
/// the main content page displayed on screen when a user clicks sidebar links.
/// It provides a consistent navigation structure across the application.
class MainShellScreen extends StatefulWidget {
  const MainShellScreen({Key? key}) : super(key: key);

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  // Current route state variable - defaults to '/events'
  String _currentRoute = '/events';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppColors.scaffoldBackground,
      // Top bar with hamburger menu, profile picture, and notification bell
      appBar: AppTopBar(
        title: _getAppBarTitle(),
        onMenuPressed: () => _scaffoldKey.currentState?.openDrawer(),
        onProfilePressed: () {
          setState(() {
            _currentRoute = '/settings';
          });
        },
        onNotificationPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Notifications feature coming soon'),
              backgroundColor: AppColors.primary,
            ),
          );
        },
        notificationCount: 3,
      ),
      // Sidebar navigation drawer
      drawer: AppSidebar(
        currentRoute: _currentRoute,
        onNavigate: (route) {
          // Update the local state to change the current route
          setState(() {
            _currentRoute = route;
          });
          // Close the drawer smoothly
          Navigator.pop(context);
        },
      ),
      // Body content based on current route
      body: _buildCurrentScreen(),
    );
  }

  /// _getAppBarTitle - Returns the appropriate title based on current route
  /// Provides context-aware titles for each screen
  String _getAppBarTitle() {
    switch (_currentRoute) {
      case '/events':
        return 'Explore Events';
      case '/tickets':
        return 'My Tickets';
      case '/wallet':
        return 'Ticket Wallet';
      case '/scan':
        return 'Scan Tickets';
      case '/scan-history':
        return 'Scan History';
      case '/agent-dashboard':
        return 'Agent Dashboard';
      case '/settings':
        return 'Settings';
      default:
        return 'EventVault';
    }
  }

  /// _buildCurrentScreen - Returns the appropriate screen widget based on current route
  /// Uses a switch statement to map route strings to screen widgets
  Widget _buildCurrentScreen() {
    switch (_currentRoute) {
      case '/events':
        return const EventExplorerScreen();
      case '/tickets':
        return const _MyTicketsScreen();
      case '/wallet':
        return const TicketWalletScreen();
      case '/scan':
        return const CameraScannerScreen();
      case '/scan-history':
        return const ScanHistoryScreen();
      case '/agent-dashboard':
        return const AgentHomeScreen();
      case '/settings':
        return const SettingsScreen();
      default:
        return const EventExplorerScreen();
    }
  }
}

/// _MyTicketsScreen - Placeholder screen for My Tickets feature
/// Displays a placeholder UI for the tickets management feature
/// This will be replaced with the actual implementation when ready
class _MyTicketsScreen extends StatelessWidget {
  const _MyTicketsScreen();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.confirmation_number_outlined,
            size: 64,
            color: AppColors.primary.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          const Text(
            'My Tickets',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Your ticket management feature',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
