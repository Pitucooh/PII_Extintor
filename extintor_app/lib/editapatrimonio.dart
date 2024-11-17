import 'package:flutter/material.dart';
import 'patrimoniodados.dart'; // Import the patrimoniodados.dart file

class EditaPatrimonio extends StatefulWidget {
  final String idEquipamento;
  final String linha;
  final String situacao;
  final String anotacoes;

  const EditaPatrimonio({
    super.key,
    required this.idEquipamento,
    required this.linha,
    required this.situacao,
    required this.anotacoes,
  });

  @override
  // ignore: library_private_types_in_public_api
  _EditaPatrimonioState createState() => _EditaPatrimonioState();
}

class _EditaPatrimonioState extends State<EditaPatrimonio> {
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

  void _navigateBack(BuildContext context) {
    Navigator.pop(context);
  }

  void _editAndNavigateBack(BuildContext context) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => PatrimonioDados(
          data: '',
          idEquipamento: idController.text,
          linha: linhaController.text,
          situacao: situacaoController.text,
          anotacoes: anotacoesController.text,
        ),
      ),
    );
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
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24), // Increased padding
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
          const SizedBox(height: 10), // Add spacing between blue box and grey box
          
          // Grey Box with Fields
          Container(
            padding: const EdgeInsets.all(15), // Reduced padding
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
                  const SizedBox(height: 10), // Small padding after the last field
                ],
              ),
            ),
          ),
          
          // Blue Box with Buttons
          Container(
            padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 24), // Increased padding
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
                    onPressed: () => _editAndNavigateBack(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.amber, // Yellow color for the button
                      padding: const EdgeInsets.symmetric(vertical: 20), // Increased padding
                      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12), // Rounded corners
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
                const SizedBox(width: 20), // Space between buttons
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _navigateBack(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey, // Grey color for the button
                      padding: const EdgeInsets.symmetric(vertical: 20), // Increased padding
                      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12), // Rounded corners
                      ),
                    ),
                    child: const Text('Voltar', style: TextStyle(color: Colors.white)),
                  ),
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