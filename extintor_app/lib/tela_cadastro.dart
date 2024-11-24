import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'tela_qrcode.dart';

class TelaCadastro extends StatefulWidget {
  final String role; // Role a ser recebida (administrador ou operador)

  const TelaCadastro({super.key, required this.role});

  @override
  _TelaCadastroState createState() => _TelaCadastroState();
}

class _TelaCadastroState extends State<TelaCadastro> {
  final TextEditingController _cpfController = TextEditingController();
  final TextEditingController _registroController = TextEditingController();
  bool isLoading = false;

  Future<void> _login(String cpf, String nRegistro, String role) async {
    setState(() {
      isLoading = true;
    });

    try {
      // body requisição
      final requestBody = {
        'cpf': cpf,
        'n_registro': nRegistro,
        'role': role,
      };

      // log xcode
      debugPrint('Request URL: http://192.168.15.41:3002/login');
      debugPrint('Request Headers: {"Content-Type": "application/json"}');
      debugPrint('Request Body: $requestBody');

      // requisição
      final response = await http.post(
        Uri.parse('http://192.168.15.41:3002/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(requestBody),
      );

      // log resposta
      debugPrint('Response Status Code: ${response.statusCode}');
      debugPrint('Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _showDialog('Sucesso', data['message']);
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
      debugPrint('Error: $error'); // log de erro
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
              child: Center(
                child: Text(
                  'Login de ${widget.role}',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Grey Box with Input Fields
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Número de Registro
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Número de Registro:',
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _registroController,
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(12)),
                        ),
                        filled: true,
                        fillColor: Colors.grey[500],
                        contentPadding: const EdgeInsets.symmetric(
                            vertical: 10, horizontal: 16),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // CPF
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'CPF:',
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _cpfController,
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(12)),
                        ),
                        filled: true,
                        fillColor: Colors.grey[500],
                        contentPadding: const EdgeInsets.symmetric(
                            vertical: 10, horizontal: 16),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Login Button
                    ElevatedButton(
                      onPressed: isLoading
                          ? null
                          : () {
                              final cpf = _cpfController.text;
                              final nRegistro = _registroController.text;

                              if (cpf.isEmpty || nRegistro.isEmpty) {
                                _showDialog(
                                    'Erro', 'Preencha todos os campos.');
                                return;
                              }

                              _login(cpf, nRegistro,
                                  widget.role); // Usando a role recebida
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF001789),
                        padding: const EdgeInsets.symmetric(vertical: 25),
                        textStyle: const TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        minimumSize: const Size(double.infinity, 80),
                      ),
                      child: isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Acessar',
                              style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Container(
            height: 10,
            color: const Color(0xFF001789),
          ),
        ],
      ),
    );
  }
}
