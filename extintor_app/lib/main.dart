import 'package:flutter/material.dart';
import 'tela_cadastro.dart';
import 'user_session.dart'; // Importando o arquivo user_session.dart

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: UserTypeScreen(),
    );
  }
}

class UserTypeScreen extends StatelessWidget {
  const UserTypeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
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
          const SizedBox(height: 60),
          Stack(
            alignment: Alignment.center,
            children: [
              // Faixa cinza no fundo
              Container(
                height: 30, // Altura da faixa cinza
                color: Colors.grey[500], // Cor cinza
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
                decoration: BoxDecoration(
                    color: const Color(0xFF001789),
                    borderRadius: BorderRadius.circular(12)),
                child: const Text(
                  'Selecione o tipo de usuário',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(
                  horizontal: 20.0,
                  vertical:
                      20.0), // Margin to avoid touching the sides and bottom
              padding:
                  const EdgeInsets.symmetric(horizontal: 40.0, vertical: 20.0),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(12), // Rounded corners
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () async {
                      await UserSession.setUserType(
                          'admin'); // Salvando tipo de usuário
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const TelaCadastro(), // Passando TelaCadastro sem parâmetro role
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[400], // Lighter grey color
                      padding: const EdgeInsets.symmetric(vertical: 25),
                      textStyle: const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(12), // Rounded corners
                      ),
                      minimumSize: const Size(double.infinity, 60),
                    ),
                    child: const Text('Administrador',
                        style: TextStyle(color: Colors.black)),
                  ),
                  const SizedBox(height: 40),
                  ElevatedButton(
                    onPressed: () async {
                      await UserSession.setUserType(
                          'operador'); // Salvando tipo de usuário
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const TelaCadastro(), // Passando TelaCadastro sem parâmetro role
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[400], // Lighter grey color
                      padding: const EdgeInsets.symmetric(vertical: 25),
                      textStyle: const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(12), // Rounded corners
                      ),
                      minimumSize: const Size(double.infinity, 60),
                    ),
                    child: const Text('Operador',
                        style: TextStyle(color: Colors.black)),
                  ),
                  const SizedBox(height: 40),
                  const Align(
                    alignment: Alignment.center,
                    child: Padding(
                      padding: EdgeInsets.all(30.0),
                      child: Text(
                        'Obs: Ao selecionar o tipo de usuário, você será redirecionado a telas com funcionalidades específicas', // O texto que você quer exibir
                        style: TextStyle(
                          fontSize: 13, // Tamanho da fonte
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Container(
            height: 10,
            color: const Color(0xFF001789),
          ),
        ],
      ),
    );
  }
}
