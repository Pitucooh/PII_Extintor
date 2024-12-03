import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // Para converter JSON em Map

class PatrimonioDados extends StatefulWidget {
  final String patrimonio;

  const PatrimonioDados({
    super.key,
    required this.patrimonio,
  });

  @override
  PatrimonioDadosState createState() => PatrimonioDadosState();
}

class PatrimonioDadosState extends State<PatrimonioDados> {
  late TextEditingController idController;
  late TextEditingController linhaController;
  late TextEditingController localController;
  late TextEditingController anotacoesController;

  bool isLoading = true; // Para mostrar o carregamento enquanto esperamos a resposta da API
  bool isError = false; // Para lidar com erros de carregamento

  @override
  void initState() {
    super.initState();
    idController = TextEditingController();
    linhaController = TextEditingController();
    localController = TextEditingController();
    anotacoesController = TextEditingController();
    _fetchPatrimonioData(widget.patrimonio); // Buscar os dados com o patrimônio
  }

  @override
  void dispose() {
    idController.dispose();
    linhaController.dispose();
    localController.dispose();
    anotacoesController.dispose();
    super.dispose();
  }

  Future<void> _fetchPatrimonioData(String patrimonio) async {
    try {
      final response = await http
          .get(Uri.parse('http://10.2.128.199:3002/busca?patrimonio=$patrimonio'))
          .timeout(const Duration(seconds: 10));
      debugPrint("Dados recebidos: $response");

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        debugPrint("Dados recebidos: $data");

        if (data.isNotEmpty) {
          setState(() {
            idController.text = data[0]['patrimonio'] ?? '';
            linhaController.text = data[0]['area'] ?? '';
            localController.text = data[0]['local'] ?? ''; // Agora com 'tipo'
            anotacoesController.text = data[0]['observacao'] ?? ''; // Agora com 'observacao'
            isLoading = false;
          });
        } else {
          setState(() {
            isError = true;
            isLoading = false;
          });
        }
      } else {
        setState(() {
          isError = true;
          isLoading = false;
        });
        print("Erro ao carregar dados do patrimônio: ${response.body}");
      }
    } catch (e) {
      setState(() {
        isError = true;
        isLoading = false;
      });
      print("Erro ao buscar os dados: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
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
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
              width: double.infinity,
              margin: const EdgeInsets.symmetric(horizontal: 24.0),
              decoration: BoxDecoration(
                color: const Color(0xFF001789),
                borderRadius: BorderRadius.circular(12),
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
            const SizedBox(height: 10),

            // Loading or Error Display
            if (isLoading)
              const CircularProgressIndicator()
            else if (isError)
              const Text("Erro ao carregar dados!", style: TextStyle(color: Colors.red)),

            // Grey Box with Fields
            if (!isLoading && !isError)
              Container(
                padding: const EdgeInsets.all(15),
                margin: const EdgeInsets.symmetric(horizontal: 24.0),
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                    bottomLeft: Radius.circular(0),
                    bottomRight: Radius.circular(0),
                  ),
                ),
                child: Container(
                  padding: const EdgeInsets.all(15),
                  decoration: BoxDecoration(
                    color: Colors.grey[400],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTextField('Id do equipamento', controller: idController),
                      const SizedBox(height: 20),
                      _buildTextField('Linha', controller: linhaController),
                      const SizedBox(height: 20),
                      _buildTextField('Local', controller: localController),
                      const SizedBox(height: 20),
                      _buildTextField('Anotações', controller: anotacoesController, maxLines: 4),
                      const SizedBox(height: 10),
                    ],
                  ),
                ),
              ),

            // Blue Box with Back Button
            Container(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 24),
              width: double.infinity,
              margin: const EdgeInsets.symmetric(horizontal: 24.0),
              decoration: const BoxDecoration(
                color: Color(0xFF001789),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(0),
                  topRight: Radius.circular(0),
                  bottomLeft: Radius.circular(12),
                  bottomRight: Radius.circular(12),
                ),
              ),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.arrow_back, color: Colors.white),
                    SizedBox(width: 5),
                    Text('Voltar', style: TextStyle(color: Colors.white)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10), // Small padding after the button
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, {required TextEditingController controller, int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 5),
        TextField(
          maxLines: maxLines,
          controller: controller,
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),
          readOnly: true,
        ),
      ],
    );
  }
}