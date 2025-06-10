import 'package:flutter/material.dart';
import '../pages/home_page.dart';

class AppRoutes {
  static const String home = '/';
  static const String prueba = '/prueba';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {



      case home:
        return MaterialPageRoute(builder: (_) => const HomePage());
      
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(child: Text('Ruta no encontrada')),
          ),
        );
    }
  }
}
