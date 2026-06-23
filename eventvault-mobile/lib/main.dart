import 'package:flutter/material.dart';
import 'app.dart';

void main() {
  // This ensures that plugin services are initialized before the application runs.
  // Useful for configuring local databases, storage modules, or payment gateways later.
  WidgetsFlutterBinding.ensureInitialized();
  
  runApp(const EventVaultApp());
}