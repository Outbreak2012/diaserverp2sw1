import 'package:flutter/material.dart';

class HomePage extends StatelessWidget 
    {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context)
     {
    return Scaffold(
      appBar: AppBar(title: const Text('Componentes generados')),
   
        body: Center(
        child: SingleChildScrollView(
          child: Column(
      
              mainAxisAlignment: MainAxisAlignment.center,
           
               children: [
                        
                 ],
          ),
        ),
      ),
    );
  }
}
