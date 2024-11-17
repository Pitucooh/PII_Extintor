import 'package:flutter/material.dart';
import 'tela_qrcode.dart';

class TelaCadastro extends StatelessWidget {
  const TelaCadastro({super.key});

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
          
          // Blue Box with "Login de usuário" Text
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
              decoration: BoxDecoration(
                color: const Color(0xFF001789),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Text(
                  'Login de usuário',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          
          // Grey Box with All Other Contents
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 20),
                    
                    // Instruction Text
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text(
                          'Digite seu número de registro e CPF',
                          style: TextStyle(fontSize: 24),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    
                    // Text Fields
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Align(
                              alignment: Alignment.centerLeft,
                              child: Text(
                                'Número de Registro:',
                                style: TextStyle(fontSize: 18),
                              ),
                            ),
                            const SizedBox(height: 10),
                            TextField(
                              decoration: InputDecoration(
                                border: const OutlineInputBorder(
                                  borderRadius: BorderRadius.all(Radius.circular(12)),
                                ),
                                filled: true,
                                fillColor: Colors.grey[500], // Darker grey color inside the text field
                                contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16), // Adjust height
                              ),
                            ),
                            const SizedBox(height: 20),
                            const Align(
                              alignment: Alignment.centerLeft,
                              child: Text(
                                'CPF:',
                                style: TextStyle(fontSize: 18),
                              ),
                            ),
                            const SizedBox(height: 10),
                            TextField(
                              decoration: InputDecoration(
                                border: const OutlineInputBorder(
                                  borderRadius: BorderRadius.all(Radius.circular(12)),
                                ),
                                filled: true,
                                fillColor: Colors.grey[500], // Darker grey color inside the text field
                                contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16), // Adjust height
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    
                    // Buttons
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const TelaQRCode()),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF001789),
                              padding: const EdgeInsets.symmetric(vertical: 25),
                              textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12), // Rounded corners
                              ),
                              minimumSize: const Size(double.infinity, 80), // Increased button size
                            ),
                            child: const Text('Acessar', style: TextStyle(color: Colors.white)),
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.grey[400],
                              padding: const EdgeInsets.symmetric(vertical: 25),
                              textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12), // Rounded corners
                              ),
                              minimumSize: const Size(200, 80), // Smaller button width
                            ),
                            child: const Text('Voltar', style: TextStyle(color: Colors.black)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 20), // Add spacing between grey box and footer
          Container(
            height: 10,
            color: const Color(0xFF001789),
          ),
        ],
      ),
    );
  }
}