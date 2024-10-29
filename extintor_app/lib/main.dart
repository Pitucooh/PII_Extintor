import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget { //widget configura layout
  const MyApp({Key? key}) : super(key: key);

  void handleRoleSelection(String role) { //recebe a selecao do usuario
    print('Função selecionada: $role'); //testar o botao
  }

  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Exntintor App'),
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
                child: Text('ADMIN'),
              ),
              SizedBox(height: 15),
              ElevatedButton(
                onPressed: () => handleRoleSelection('operador'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white
                ),
                child: Text('OPERADOR'),
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
