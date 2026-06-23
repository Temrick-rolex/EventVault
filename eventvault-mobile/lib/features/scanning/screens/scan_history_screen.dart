import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

/// ScanHistoryScreen - Scan history and verification logs screen
/// This screen displays the history of ticket scans performed by agents.
/// It is designed to be used within the MainShellScreen wrapper.
class ScanHistoryScreen extends StatelessWidget {
  const ScanHistoryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 4,
      itemBuilder: (context, index) {
        return ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          tileColor: const Color(0xFF020617),
          leading: const Icon(Icons.check_circle, color: Color(0xFF10B981)),
          title: Text("Ticket ID: #EV-9082$index", style: const TextStyle(color: Colors.white)),
          subtitle: const Text("Scanned at 08:34 PM", style: TextStyle(color: Color(0xFF64748B))),
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(6)),
            child: const Text("VALID", style: TextStyle(color: Color(0xFF34D399), fontSize: 11)),
          ),
        );
      },
    );
  }
}