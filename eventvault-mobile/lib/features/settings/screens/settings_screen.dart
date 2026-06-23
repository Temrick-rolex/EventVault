import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

/// SettingsScreen - User settings and preferences screen
/// This screen provides a tabbed interface for managing user profile,
/// security settings, and notification preferences.
/// Matches the web frontend design but scoped for Attendee/Agent roles.
/// Uses the established EventVault color scheme for consistency.
/// It is designed to be used within the MainShellScreen wrapper.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _activeTab = 'profile';

  // Profile data state
  final Map<String, String> _profile = {
    'firstName': 'John',
    'lastName': 'Doe',
    'email': 'john.doe@email.com',
    'phone': '+1 (555) 123-4567',
  };

  // Security settings state
  final Map<String, bool> _security = {
    'twoFactorEnabled': true,
    'loginAlerts': true,
  };

  // Notification preferences state
  final Map<String, bool> _notifications = {
    'email': true,
    'push': true,
    'ticketSales': true,
    'eventReminders': true,
    'agentUpdates': true,
    'escrowAlerts': true,
  };

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Tab navigation bar
        _TabBar(
          activeTab: _activeTab,
          onTabChanged: (tab) {
            setState(() {
              _activeTab = tab;
            });
          },
        ),
        const SizedBox(height: 16),
        // Tab content based on selection
        _buildTabContent(),
      ],
    );
  }

  /// _buildTabContent - Returns the appropriate widget based on active tab
  /// Displays Profile, Security, or Notifications settings based on user selection
  Widget _buildTabContent() {
    switch (_activeTab) {
      case 'profile':
        return _ProfileTab(profile: _profile);
      case 'security':
        return _SecurityTab(security: _security);
      case 'notifications':
        return _NotificationsTab(notifications: _notifications);
      default:
        return const SizedBox.shrink();
    }
  }
}

/// _TabBar - Horizontal tab navigation widget
/// Provides tab switching between Profile, Security, and Notifications
/// Highlights the active tab with emerald accent color
class _TabBar extends StatelessWidget {
  final String activeTab;
  final Function(String) onTabChanged;

  const _TabBar({
    required this.activeTab,
    required this.onTabChanged,
  });

  @override
  Widget build(BuildContext context) {
    final tabs = [
      {'id': 'profile', 'label': 'Profile', 'icon': Icons.person_outline},
      {'id': 'security', 'label': 'Security', 'icon': Icons.shield_outlined},
      {'id': 'notifications', 'label': 'Notifications', 'icon': Icons.notifications_outlined},
    ];

    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: tabs.map((tab) {
          final isActive = activeTab == tab['id'];
          return Expanded(
            child: GestureDetector(
              onTap: () => onTabChanged(tab['id'] as String),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: isActive ? AppColors.primary.withOpacity(0.1) : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: isActive
                      ? Border.all(color: AppColors.primary, width: 1)
                      : null,
                ),
                child: Column(
                  children: [
                    Icon(
                      tab['icon'] as IconData,
                      color: isActive ? AppColors.primaryLight : AppColors.iconSecondary,
                      size: 24,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      tab['label'] as String,
                      style: TextStyle(
                        color: isActive ? AppColors.primaryLight : AppColors.textSecondary,
                        fontSize: 12,
                        fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

/// _ProfileTab - Profile information and editing widget
/// Allows users to view and edit their personal information
/// Matches the web frontend profile section design
class _ProfileTab extends StatelessWidget {
  final Map<String, String> profile;

  const _ProfileTab({required this.profile});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Profile Information',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          // First Name Field
          _ProfileField(
            label: 'First Name',
            value: profile['firstName']!,
            icon: Icons.person_outline,
          ),
          const SizedBox(height: 16),
          // Last Name Field
          _ProfileField(
            label: 'Last Name',
            value: profile['lastName']!,
            icon: Icons.person_outline,
          ),
          const SizedBox(height: 16),
          // Email Field
          _ProfileField(
            label: 'Email',
            value: profile['email']!,
            icon: Icons.email_outlined,
          ),
          const SizedBox(height: 16),
          // Phone Field
          _ProfileField(
            label: 'Phone',
            value: profile['phone']!,
            icon: Icons.phone_outlined,
          ),
          const SizedBox(height: 24),
          // Save Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Profile updated successfully!'),
                    backgroundColor: AppColors.primary,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Save Changes',
                style: TextStyle(
                  color: AppColors.cardBackground,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// _ProfileField - Individual profile input field widget
/// Displays a labeled input field with icon for profile information
/// Provides consistent styling across all profile fields
class _ProfileField extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _ProfileField({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController(text: value);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: AppColors.inputBackground,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: TextField(
            controller: controller,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 16,
            ),
            decoration: InputDecoration(
              prefixIcon: Icon(
                icon,
                color: AppColors.iconSecondary,
                size: 20,
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 14,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// _SecurityTab - Security settings and preferences widget
/// Allows users to manage two-factor authentication, login alerts, and password
/// Matches the web frontend security section design
class _SecurityTab extends StatelessWidget {
  final Map<String, bool> security;

  const _SecurityTab({required this.security});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Security Settings Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Security Settings',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              // Two-Factor Authentication Toggle
              _SecurityToggleItem(
                title: 'Two-Factor Authentication',
                description: 'Add an extra layer of security to your account',
                icon: Icons.security,
                isEnabled: security['twoFactorEnabled']!,
              ),
              const SizedBox(height: 16),
              // Login Alerts Toggle
              _SecurityToggleItem(
                title: 'Login Alerts',
                description: 'Get notified when someone logs into your account',
                icon: Icons.notifications_active,
                isEnabled: security['loginAlerts']!,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Change Password Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Change Password',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Password change link sent to your email!'),
                        backgroundColor: AppColors.primary,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.borderLight,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Change Password',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// _SecurityToggleItem - Security toggle switch widget
/// Displays a security setting with toggle switch for enabling/disabling
/// Provides visual feedback with emerald accent when enabled
class _SecurityToggleItem extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final bool isEnabled;

  const _SecurityToggleItem({
    required this.title,
    required this.description,
    required this.icon,
    required this.isEnabled,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.inputBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isEnabled ? AppColors.primary.withOpacity(0.1) : AppColors.border.withOpacity(0.3),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: isEnabled ? AppColors.primaryLight : AppColors.iconSecondary,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          // Toggle Switch
          Switch(
            value: isEnabled,
            onChanged: (value) {
              // TODO: Implement toggle logic
            },
            activeColor: AppColors.primary,
            activeTrackColor: AppColors.primary.withOpacity(0.3),
          ),
        ],
      ),
    );
  }
}

/// _NotificationsTab - Notification preferences widget
/// Allows users to manage their notification preferences for various events
/// Matches the web frontend notifications section design
class _NotificationsTab extends StatelessWidget {
  final Map<String, bool> notifications;

  const _NotificationsTab({required this.notifications});

  @override
  Widget build(BuildContext context) {
    final notificationItems = [
      {
        'title': 'Email Notifications',
        'description': 'Receive updates via email',
        'icon': Icons.email_outlined,
        'key': 'email',
      },
      {
        'title': 'Push Notifications',
        'description': 'Receive push notifications on your device',
        'icon': Icons.phone_android_outlined,
        'key': 'push',
      },
      {
        'title': 'Ticket Sales',
        'description': 'Get notified when tickets are sold',
        'icon': Icons.confirmation_number_outlined,
        'key': 'ticketSales',
      },
      {
        'title': 'Event Reminders',
        'description': 'Reminders before your events',
        'icon': Icons.event_outlined,
        'key': 'eventReminders',
      },
      {
        'title': 'Agent Updates',
        'description': 'Updates from verification agents',
        'icon': Icons.badge_outlined,
        'key': 'agentUpdates',
      },
      {
        'title': 'Escrow Alerts',
        'description': 'Alerts about fund releases and disputes',
        'icon': Icons.account_balance_outlined,
        'key': 'escrowAlerts',
      },
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Notification Preferences',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          ...notificationItems.map((item) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _NotificationToggleItem(
                title: item['title'] as String,
                description: item['description'] as String,
                icon: item['icon'] as IconData,
                isEnabled: notifications[item['key'] as String]!,
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}

/// _NotificationToggleItem - Notification toggle switch widget
/// Displays a notification preference with toggle switch
/// Provides consistent styling across all notification settings
class _NotificationToggleItem extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final bool isEnabled;

  const _NotificationToggleItem({
    required this.title,
    required this.description,
    required this.icon,
    required this.isEnabled,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.inputBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isEnabled ? AppColors.primary.withOpacity(0.1) : AppColors.border.withOpacity(0.3),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: isEnabled ? AppColors.primaryLight : AppColors.iconSecondary,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          // Toggle Switch
          Switch(
            value: isEnabled,
            onChanged: (value) {
              // TODO: Implement toggle logic
            },
            activeColor: AppColors.primary,
            activeTrackColor: AppColors.primary.withOpacity(0.3),
          ),
        ],
      ),
    );
  }
}
