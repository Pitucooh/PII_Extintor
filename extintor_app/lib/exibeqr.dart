import 'package:flutter/material.dart';

class ExibeQR extends StatelessWidget {
  final String data;

  const ExibeQR({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Exibe QR'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Dados do QR Code:',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                data,
                style: const TextStyle(
                  fontSize: 18,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text('Voltar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}




/*import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart'; // Ensure this package is imported
import 'patrimoniodados.dart'; // Import the patrimoniodados.dart file

class ExibeQR extends StatelessWidget {
  final String data;

  const ExibeQR({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Header
          Container(
            color: const Color(0xFF001789),
            height: 120,
            width: double.infinity,
            child: Center(
              child: Image.asset(
                'assets/images/LOGO.jpg',
                fit: BoxFit.contain,
                height: 80,
              ),
            ),
          ),
          const SizedBox(height: 20),
          
          // Blue Box with "Patrimônio"
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
            width: 350,
            decoration: BoxDecoration(
              color: const Color(0xFF001789),
              borderRadius: BorderRadius.circular(12)
            ),
            child: const Center(
              child: Text(
                'Patrimônio',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          
          // Grey Box with QR Code
          Container(
            padding: const EdgeInsets.all(20),
            margin: const EdgeInsets.symmetric(horizontal: 24.0),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: QrImage(
                data: data,
                version: QrVersions.auto,
                size: 200.0,
              ),
            ),
          ),
          const SizedBox(height: 20),
          
          // Blue Box with Buttons
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
            width: 350,
            decoration: BoxDecoration(
              color: const Color(0xFF001789),
              borderRadius: BorderRadius.circular(12)
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey[600], // Darker grey color
                    padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
                    textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12), // Rounded corners
                    ),
                  ),
                  child: const Text('Voltar', style: TextStyle(color: Colors.white)),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const PatrimonioDados()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey[600], // Darker grey color
                    padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
                    textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12), // Rounded corners
                    ),
                  ),
                  child: const Text('Imprimir', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}*/