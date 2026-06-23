import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

/// CameraScannerScreen - Camera-based QR code scanner screen
/// This screen provides the live camera interface for ticket verification.
/// It is designed to be used within the MainShellScreen wrapper.
class CameraScannerScreen extends StatelessWidget {
  const CameraScannerScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Simulated Camera Preview Center Node
        const Center(child: Text("Camera view viewport will active here...", style: TextStyle(color: Color(0xFF64748B)))),
        
        // Outer Scan Focus Brackets UI Layout Overlay
        Center(
          child: Container(
            width: 250,
            height: 250,
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFF10B981), width: 2),
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
        
        // Dynamic Bottom Floating Status Tracker Card
        Positioned(
          bottom: 30, left: 20, right: 20,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFF020617), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF1E293B))),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text("Terminal Shift Mode", style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                    SizedBox(height: 4),
                    Text("Active Gate Scanning", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), shape: BoxShape.circle),
                  child: const Icon(Icons.qr_code_scanner, color: Color(0xFF34D399)),
                )
              ],
            ),
          ),
        )
      ],
    );
  }
}