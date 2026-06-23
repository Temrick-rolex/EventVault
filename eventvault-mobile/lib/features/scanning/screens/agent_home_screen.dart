import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

/// AgentHomeScreen - Agent dashboard and gate terminal screen
/// This screen provides agent tools for ticket verification and gate management.
/// It is designed to be used within the MainShellScreen wrapper.
class AgentHomeScreen extends StatelessWidget {
  const AgentHomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF020617), borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text("Assigned Shift Venue", style: TextStyle(color: Color(0xFF64748B))),
                SizedBox(height: 4),
                Text("Tech Innovation Summit 2026", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.camera_alt),
            label: const Text("Launch Gate Scanner"),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: const Color(0xFF020617),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }
}