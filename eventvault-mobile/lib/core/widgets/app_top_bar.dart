import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// AppTopBar - Reusable top navigation bar widget
/// This widget provides a consistent top bar across all screens with:
/// - Hamburger menu icon for opening sidebar navigation
/// - Profile picture for user account access
/// - Notification bell for alerts and updates
/// Uses the established EventVault color scheme for consistency
class AppTopBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback onMenuPressed;
  final VoidCallback onProfilePressed;
  final VoidCallback onNotificationPressed;
  final int notificationCount;
  final String profileImageUrl;

  const AppTopBar({
    Key? key,
    required this.title,
    required this.onMenuPressed,
    required this.onProfilePressed,
    required this.onNotificationPressed,
    this.notificationCount = 0,
    this.profileImageUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.cardBackground,
      elevation: 0,
      leading: IconButton(
        // Hamburger menu icon - Opens sidebar navigation
        icon: const Icon(
          Icons.menu,
          color: AppColors.iconPrimary,
          size: 28,
        ),
        onPressed: onMenuPressed,
        tooltip: 'Open navigation menu',
      ),
      title: Text(
        title,
        style: const TextStyle(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.bold,
          fontSize: 20,
        ),
      ),
      centerTitle: true,
      actions: [
        // Notification bell with badge count
        _NotificationBell(
          onPressed: onNotificationPressed,
          count: notificationCount,
        ),
        const SizedBox(width: 8),
        // Profile picture - Opens profile/settings
        _ProfilePicture(
          imageUrl: profileImageUrl,
          onPressed: onProfilePressed,
        ),
        const SizedBox(width: 16),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

/// _NotificationBell - Notification bell widget with badge
/// Displays a bell icon with an optional red badge showing unread count
/// Provides visual feedback for user notifications
class _NotificationBell extends StatelessWidget {
  final VoidCallback onPressed;
  final int count;

  const _NotificationBell({
    required this.onPressed,
    this.count = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        IconButton(
          // Bell icon for notifications
          icon: const Icon(
            Icons.notifications_outlined,
            color: AppColors.iconPrimary,
            size: 26,
          ),
          onPressed: onPressed,
          tooltip: 'Notifications',
        ),
        if (count > 0)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              // Red badge showing notification count
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppColors.error,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.cardBackground, width: 2),
              ),
              constraints: const BoxConstraints(
                minWidth: 18,
                minHeight: 18,
              ),
              child: Text(
                count > 9 ? '9+' : count.toString(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }
}

/// _ProfilePicture - Circular profile picture widget
/// Displays user avatar with tap gesture for profile access
/// Uses circular clip for modern, clean appearance
class _ProfilePicture extends StatelessWidget {
  final String imageUrl;
  final VoidCallback onPressed;

  const _ProfilePicture({
    required this.imageUrl,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: AppColors.primary,
            width: 2,
          ),
        ),
        child: ClipOval(
          child: Image.network(
            imageUrl,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              // Fallback to default avatar if image fails to load
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
    );
  }
}
