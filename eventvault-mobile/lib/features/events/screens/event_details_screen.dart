import 'package:flutter/material.dart';

class EventDetailsScreen extends StatelessWidget {
  const EventDetailsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: CustomScrollView(
        slivers: [
          const SliverAppBar(
            expandedHeight: 240,
            backgroundColor: Color(0xFF020617),
            flexibleSpace: FlexibleSpaceBar(
              background: Placeholder(), // Replace with image banner later
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Tech Innovation Summit 2026", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text("Organized by Premium Hosts", style: TextStyle(color: Color(0xFF10B981), fontSize: 14)),
                  const Divider(color: Color(0xFF1E293B), height: 32),
                  const Text("About Event", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(
                    "Join us for an expansive exploration of tech innovation infrastructure frameworks, AI tools orchestration, and database operations scale.",
                    style: TextStyle(color: Color(0xFF94A3B8), height: 1.5),
                  ),
                  const SizedBox(height: 40),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      minimumSize: const Size.fromHeight(50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text("Reserve Tickets Safely", style: TextStyle(color: Color(0xFF020617), fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}