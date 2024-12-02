import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'tela_qrcode.dart';
import 'user_session.dart';

class TelaCadastro extends StatefulWidget { 
  const TelaCadastro({super.key});

  @override
  _TelaCadastroState createState() => _TelaCadastroState();
}

class _TelaCadastroState extends State<TelaCadastro> {
  final TextEditingController _cpfController = TextEditingController();
  final TextEditingController _registroController = TextEditingController();
  bool isLoading = false;

  // Obtendo o tipo de usuário diretamente do UserSession
  Future<String> get role async => await UserSession.getUserType() ?? ''; // Se for nulo, retorna uma string vazia
  String roleValue = '';

  Future<void> _login(String cpf, String nRegistro, String role) async {
    setState(() {
      isLoading = true;
    });

    try {
      final requestBody = {
        'cpf': cpf,
        'n_registro': nRegistro,
        'role': role,
      };

      debugPrint('Request URL: http://192.168.15.41:3002/login');
      debugPrint('Request Headers: {"Content-Type": "application/json"}');
      debugPrint('Request Body: $requestBody');

      final response = await http.post(
        Uri.parse('http://192.168.15.41:3002/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(requestBody),
      );

      debugPrint('Response Status Code: ${response.statusCode}');
      debugPrint('Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _showDialog('Sucesso', data['message']);

        if (role == 'administrador') {
          UserSession.setUserType('admin');
        } else if (role == 'operador') {
          UserSession.setUserType('operador');
        }

        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const TelaQRCode()),
        );
      } else if (response.statusCode == 401) {
        _showDialog('Erro', 'Credenciais inválidas.');
      } else if (response.statusCode == 403) {
        _showDialog('Erro', json.decode(response.body)['message']);
      } else {
        _showDialog('Erro', 'Erro desconhecido. Tente novamente.');
      }
    } catch (error) {
      debugPrint('Error: $error');
      _showDialog('Erro', 'Erro ao se conectar ao servidor.');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _showDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _cpfController.dispose();
    _registroController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    UserSession.getUserType().then((value) {
      setState(() {
        roleValue = value ?? '';
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(  // Adicionando SingleChildScrollView para permitir rolagem
        child: Column(
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
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
                decoration: BoxDecoration(
                  color: const Color(0xFF001789),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    'Login de $roleValue',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
              padding: const EdgeInsets.symmetric(horizontal: 40.0, vertical: 20.0),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextField(
                    controller: _cpfController,
                    decoration: const InputDecoration(
                      labelText: 'CPF',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _registroController,
                    decoration: const InputDecoration(
                      labelText: 'Número de Registro',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 40),
                  isLoading
                      ? const CircularProgressIndicator()
                      : ElevatedButton(
                          onPressed: () {
                            final cpf = _cpfController.text;
                            final nRegistro = _registroController.text;

                            if (cpf.isEmpty || nRegistro.isEmpty) {
                              _showDialog('Erro', 'Preencha todos os campos.');
                            } else {
                              _login(cpf, nRegistro, roleValue);
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            textStyle: const TextStyle(
                                fontSize: 22, fontWeight: FontWeight.bold),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            minimumSize: const Size(double.infinity, 60),
                          ),
                          child: const Text('Entrar'),
                        ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}