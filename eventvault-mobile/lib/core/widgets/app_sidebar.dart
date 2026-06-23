import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// AppSidebar - Slide-out navigation drawer widget
/// This widget provides a sidebar navigation menu that slides in from the left
/// when triggered by the hamburger menu. It contains navigation links to all
/// available pages (will be filtered by role upon backend integration).
/// Uses the established EventVault color scheme for consistency.
class AppSidebar extends StatelessWidget {
  final String currentRoute;
  final Function(String) onNavigate;

  const AppSidebar({
    Key? key,
    required this.currentRoute,
    required this.onNavigate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: AppColors.cardBackground,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Sidebar Header with logo and user info
          _SidebarHeader(),
          
          const Divider(
            color: AppColors.border,
            thickness: 1,
          ),
          
          // Navigation Links Section
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              'NAVIGATION',
              style: TextStyle(
                color: AppColors.textTertiary,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
          ),
          
          // Attendee Navigation Links
          _NavigationItem(
            icon: Icons.explore_outlined,
            label: 'Explore Events',
            route: '/events',
            isSelected: currentRoute == '/events',
            onTap: () => onNavigate('/events'),
          ),
          _NavigationItem(
            icon: Icons.confirmation_number_outlined,
            label: 'My Tickets',
            route: '/tickets',
            isSelected: currentRoute == '/tickets',
            onTap: () => onNavigate('/tickets'),
          ),
          _NavigationItem(
            icon: Icons.wallet_outlined,
            label: 'Ticket Wallet',
            route: '/wallet',
            isSelected: currentRoute == '/wallet',
            onTap: () => onNavigate('/wallet'),
          ),
          
          const Divider(
            color: AppColors.border,
            thickness: 1,
          ),
          
          // Agent Navigation Links
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              'AGENT TOOLS',
              style: TextStyle(
                color: AppColors.textTertiary,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
          ),
          
          _NavigationItem(
            icon: Icons.qr_code_scanner_outlined,
            label: 'Scan Tickets',
            route: '/scan',
            isSelected: currentRoute == '/scan',
            onTap: () => onNavigate('/scan'),
          ),
          _NavigationItem(
            icon: Icons.history_outlined,
            label: 'Scan History',
            route: '/scan-history',
            isSelected: currentRoute == '/scan-history',
            onTap: () => onNavigate('/scan-history'),
          ),
          _NavigationItem(
            icon: Icons.dashboard_outlined,
            label: 'Agent Dashboard',
            route: '/agent-dashboard',
            isSelected: currentRoute == '/agent-dashboard',
            onTap: () => onNavigate('/agent-dashboard'),
          ),
          
          const Divider(
            color: AppColors.border,
            thickness: 1,
          ),
          
          // Settings and Account Section
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              'ACCOUNT',
              style: TextStyle(
                color: AppColors.textTertiary,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
          ),
          
          _NavigationItem(
            icon: Icons.settings_outlined,
            label: 'Settings',
            route: '/settings',
            isSelected: currentRoute == '/settings',
            onTap: () => onNavigate('/settings'),
          ),
          _NavigationItem(
            icon: Icons.help_outline,
            label: 'Help & Support',
            route: '/help',
            isSelected: currentRoute == '/help',
            onTap: () => onNavigate('/help'),
          ),
          _NavigationItem(
            icon: Icons.info_outline,
            label: 'About EventVault',
            route: '/about',
            isSelected: currentRoute == '/about',
            onTap: () => onNavigate('/about'),
          ),
          
          const Divider(
            color: AppColors.border,
            thickness: 1,
          ),
          
          // Logout Button
          _LogoutItem(
            onTap: () {
              Navigator.pop(context);
              // Navigate to login screen for logout
              Navigator.pushReplacementNamed(context, '/');
            },
          ),
        ],
      ),
    );
  }
}

/// _SidebarHeader - Header section of the sidebar
/// Displays the EventVault logo/branding and user profile summary
/// Provides visual identity to the navigation drawer
class _SidebarHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.cardBackground,
            AppColors.scaffoldBackground,
          ],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo/Brand Icon
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.primary.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: const Icon(
              Icons.shield_outlined,
              color: AppColors.primaryLight,
              size: 32,
            ),
          ),
          const SizedBox(height: 16),
          // App Name
          const Text(
            'EventVault',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          // Tagline
          const Text(
            'purchase your tickets with confidence',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 16),
          // User Profile Summary
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.primary,
                    width: 2,
                  ),
                ),
                child: ClipOval(
                  child: Image.network(
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: AppColors.primary.withOpacity(0.2),
                        child: const Icon(
                          Icons.person,
                          color: AppColors.primary,
                          size: 24,
                        ),
                      );
                    },
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'John Doe',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'john.doe@email.com',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// _NavigationItem - Individual navigation link widget
/// Represents a single navigation item in the sidebar with icon and label
/// Highlights the currently selected route and handles tap navigation
class _NavigationItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavigationItem({
    required this.icon,
    required this.label,
    required this.route,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? AppColors.primaryLight : AppColors.iconSecondary,
        size: 24,
      ),
      title: Text(
        label,
        style: TextStyle(
          color: isSelected ? AppColors.primaryLight : AppColors.textSecondary,
          fontSize: 15,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      selectedTileColor: AppColors.primary.withOpacity(0.1),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }
}

/// _LogoutItem - Logout button widget
/// Special navigation item for logout action with warning color
/// Provides visual distinction from regular navigation items
class _LogoutItem extends StatelessWidget {
  final VoidCallback onTap;

  const _LogoutItem({
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const Icon(
        Icons.logout_outlined,
        color: AppColors.error,
        size: 24,
      ),
      title: const Text(
        'Logout',
        style: TextStyle(
          color: AppColors.error,
          fontSize: 15,
          fontWeight: FontWeight.bold,
        ),
      ),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }
}
