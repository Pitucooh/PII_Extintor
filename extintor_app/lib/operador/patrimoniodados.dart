import 'package:flutter/material.dart';
// Import the editapatrimonio.dart file

class PatrimonioDados extends StatefulWidget {
  final String data;
  final String idEquipamento;
  final String linha;
  final String situacao;
  final String anotacoes;

  const PatrimonioDados({
    super.key,
    required this.data,
    required this.idEquipamento,
    required this.linha,
    required this.situacao,
    required this.anotacoes,
  });

  @override
  _PatrimonioDadosState createState() => _PatrimonioDadosState();
}

class _PatrimonioDadosState extends State<PatrimonioDados> {
  late TextEditingController idController;
  late TextEditingController linhaController;
  late TextEditingController situacaoController;
  late TextEditingController anotacoesController;

  @override
  void initState() {
    super.initState();
    idController = TextEditingController(text: widget.idEquipamento);
    linhaController = TextEditingController(text: widget.linha);
    situacaoController = TextEditingController(text: widget.situacao);
    anotacoesController = TextEditingController(text: widget.anotacoes);
  }

  @override
  void dispose() {
    idController.dispose();
    linhaController.dispose();
    situacaoController.dispose();
    anotacoesController.dispose();
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

          // Blue Box with "Patrimônio"
          Container(
            padding: const EdgeInsets.symmetric(
                vertical: 20, horizontal: 24), // Increased padding
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
          const SizedBox(
              height: 10), // Add spacing between blue box and grey box

          // Grey Box with Fields
          Container(
            padding: const EdgeInsets.all(15), // Reduced padding
            margin: const EdgeInsets.symmetric(horizontal: 24.0),
            decoration: BoxDecoration(
              color: Colors.grey[300],
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
                  _buildTextField(context, 'Id do equipamento',
                      controller: idController),
                  const SizedBox(height: 20),
                  _buildTextField(context, 'Linha',
                      controller: linhaController),
                  const SizedBox(height: 20),
                  _buildTextField(context, 'Situação',
                      controller: situacaoController),
                  const SizedBox(height: 20),
                  _buildTextField(context, 'Anotações',
                      controller: anotacoesController, maxLines: 4),
                  const SizedBox(
                      height: 10), // Small padding after the last field
                ],
              ),
            ),
          ),

          // Blue Box with Buttons
          Container(
            padding: const EdgeInsets.symmetric(
                vertical: 30, horizontal: 24), // Increased padding
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
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {
                    // Ação do botão de excluir
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red, // Red color for the button
                    padding: const EdgeInsets.symmetric(
                        vertical: 15, horizontal: 20),
                    textStyle: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(12), // Rounded corners
                    ),
                  ),
                  child: const Icon(Icons.delete, color: Colors.white),
                ),
              ],
            ),
          ),
          const Spacer(), // Pushes the bar to the bottom
          Container(
            height: 10,
            color: const Color(0xFF001789),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(BuildContext context, String label,
      {required TextEditingController controller, int maxLines = 1}) {
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
          decoration: const InputDecoration(
            filled: true,
            fillColor: Colors.white,
          ),
        ),
      ],
    );
  }
}
