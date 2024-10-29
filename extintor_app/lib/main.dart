import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget { //widget configura layout
  const MyApp({super.key});

  void handleRoleSelection(String role) { //recebe a selecao do usuario
    print('Função selecionada: $role'); //testar o botao
  }

  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Exntintor App'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: () => handleRoleSelection('admin'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white
                ),
                child: const Text('ADMIN'),
              ),
              const SizedBox(height: 15),
              ElevatedButton(
                onPressed: () => handleRoleSelection('operador'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white
                ),
                child: const Text('OPERADOR'),
              ),
              GestureDetector(
                onTap: () {
                  // Ação ao clicar na imagem
                  print('Imagem como botão clicada!');
                },
                child: Image.asset(
                  'pii_extintor/src/assets/cameraScan.png', // Caminho da imagem
                  width: 100, // Largura do botão
                  height: 100, // Altura do botão
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
