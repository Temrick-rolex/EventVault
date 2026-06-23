import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

/// TicketWalletScreen - Ticket management and wallet screen
/// This screen displays the user's ticket vault with QR codes for event entry.
/// It is designed to be used within the MainShellScreen wrapper.
class TicketWalletScreen extends StatelessWidget {
  const TicketWalletScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 300,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text("VIP ACCESS PASS", style: TextStyle(color: Color(0xFF34D399), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
            const SizedBox(height: 8),
            const Text("Tech Innovation Summit", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const Divider(color: Color(0xFF1E293B), height: 32),
            
            // Emulated QR Code Box
            Container(
              width: 180,
              height: 180,
              color: Colors.white,
              padding: const EdgeInsets.all(8),
              child: const Placeholder(color: Colors.black, fallbackHeight: 160, fallbackWidth: 160), 
              // Note: You will replace Placeholder with QrImageView() from qr_flutter package later
            ),
            
            const Divider(color: Color(0xFF1E293B), height: 32),
            const Text("HASH: EV_TX90823411_SECURE", style: TextStyle(color: Color(0xFF64748B), fontFamily: 'monospace', fontSize: 11)),
          ],
        ),
      ),
    );
  }
}