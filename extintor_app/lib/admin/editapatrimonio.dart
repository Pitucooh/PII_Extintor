import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // Para converter JSON em Map

class EditaPatrimonio extends StatelessWidget {
  final String patrimonio;

  const EditaPatrimonio({
    super.key,
    required this.patrimonio,
  });

  @override
  _EditaPatrimonioState createState() => _EditaPatrimonioState();
}

class _EditaPatrimonioState extends State<EditaPatrimonio> {
  late TextEditingController idController;
  late TextEditingController linhaController;
  late TextEditingController situacaoController;
  late TextEditingController anotacoesController;

  bool isLoading = true; // Para mostrar o carregamento enquanto esperamos a resposta da API
  bool isError = false; // Para lidar com erros de carregamento

  @override
  void initState() {
    super.initState();
    idController = TextEditingController();
    linhaController = TextEditingController();
    situacaoController = TextEditingController();
    anotacoesController = TextEditingController();
    _fetchPatrimonioData(widget.patrimonio); // Buscar os dados com o patrimônio
  }

  @override
  void dispose() {
    idController.dispose();
    linhaController.dispose();
    situacaoController.dispose();
    anotacoesController.dispose();
    super.dispose();
  }

  Future<void> _fetchPatrimonioData(String patrimonio) async {
    final response = await http.get(Uri.parse(
        'http://192.168.15.41:3002/busca?patrimonio=$patrimonio'));

    if (response.statusCode == 200) {
      try {
        final List<dynamic> data = json.decode(response.body);

        if (data.isNotEmpty) {
          setState(() {
            idController.text = data[0]['id_equipamento'] ?? '';
            linhaController.text = data[0]['linha'] ?? '';
            situacaoController.text = data[0]['situacao'] ?? '';
            anotacoesController.text = data[0]['anotacoes'] ?? '';
            isLoading = false;
          });
        } else {
          setState(() {
            isError = true;
            isLoading = false;
          });
        }
      } catch (e) {
        setState(() {
          isError = true;
          isLoading = false;
        });
        print("Erro ao processar os dados: $e");
      }
    } else {
      setState(() {
        isError = true;
        isLoading = false;
      });
      throw Exception('Falha ao carregar dados do patrimônio');
    }
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
                    _buildTextField('Situação', controller: situacaoController),
                    const SizedBox(height: 20),
                    _buildTextField('Anotações', controller: anotacoesController, maxLines: 4),
                    const SizedBox(height: 10),
                  ],
                ),
              ),
            ),

          // Blue Box with Buttons
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
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Salvar ou editar o patrimônio
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.amber,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.save, color: Colors.white),
                        SizedBox(width: 5),
                        Text('Editar', style: TextStyle(color: Colors.white)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Voltar
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Voltar', style: TextStyle(color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
          const Spacer(),
          Container(
            height: 10,
            color: const Color(0xFF001789),
          ),
        ],
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
            suffixIcon: IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                // Ação do ícone de editar
              },
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      ],
    );
  }
}