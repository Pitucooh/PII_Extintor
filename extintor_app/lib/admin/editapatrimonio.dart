import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // Para converter JSON em Map

class EditaPatrimonio extends StatefulWidget {
  final String patrimonio;

  const EditaPatrimonio({
    super.key,
    required this.patrimonio,
  });

  @override
  EditaPatrimonioState createState() => EditaPatrimonioState();
}

class EditaPatrimonioState extends State<EditaPatrimonio> {
  late TextEditingController idController;
  late TextEditingController linhaController;
  late TextEditingController situacaoController;
  late TextEditingController anotacoesController;

  bool isLoading = true; // Para mostrar o carregamento enquanto esperamos a resposta da API
  bool isError = false; // Para lidar com erros de carregamento
  bool isSaving = false;

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

  // Função para salvar as alterações
  Future<void> _salvarAlteracoes() async {
    final url = 'http://192.168.15.41:3002/atualizar';
    final body = json.encode({
      'id_equipamento': idController.text,
      'linha': linhaController.text,
      'situacao': situacaoController.text,
      'anotacoes': anotacoesController.text,
    });

    try {
      setState(() {
        isSaving = true;
      });

      final response = await http
          .put(Uri.parse(url),
              headers: {'Content-Type': 'application/json'}, body: body)
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        // Sucesso
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Dados atualizados com sucesso!")),
        );
      } else {
        // Falha
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Erro ao salvar: ${response.body}")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erro ao salvar: $e")),
      );
    } finally {
      setState(() {
        isSaving = false;
      });
    }
  }

  Future<void> _fetchPatrimonioData(String patrimonio) async {
  try {
    final response = await http
        .get(Uri.parse('http://192.168.15.41:3002/busca?patrimonio=$patrimonio'))
        .timeout(const Duration(seconds: 10));

    if (response.statusCode == 200) {
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

Future<void> _excluirPatrimonio() async {
  final url = 'http://192.168.15.41:3002/deletar';
  final body = json.encode({
    'id_equipamento': idController.text, // Ou o ID do patrimônio
  });

  try {
    final response = await http
        .delete(Uri.parse(url),
            headers: {'Content-Type': 'application/json'}, body: body)
        .timeout(const Duration(seconds: 10));

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Patrimônio excluído com sucesso!")),
      );
      Navigator.pop(context); // Voltar para a tela anterior após a exclusão
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erro ao excluir: ${response.body}")),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Erro ao excluir: $e")),
    );
  }
}

Future<bool> _confirmarExclusao(BuildContext context) async {
  return await showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text('Confirmar Exclusão'),
        content: const Text('Tem certeza de que deseja excluir este patrimônio?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false), // Retorna false
            child: const Text(
              'Cancelar',
              style: TextStyle(color: Colors.blue),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true), // Retorna true
            child: const Text(
              'Excluir',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      );
    },
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
                    onPressed: isSaving ? null : _salvarAlteracoes,
                      // Salvar ou editar o patrimônio
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.amber,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: isSaving
                        ? const CircularProgressIndicator()
                        : const Row(
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

                // Botão de Excluir
                Expanded(
                  child: ElevatedButton(
                    onPressed: () async {
                      final confirm = await _confirmarExclusao(context);
                      if (confirm) {
                        await _excluirPatrimonio();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.delete, color: Colors.white),
                        SizedBox(width: 5),
                        Text('Excluir', style: TextStyle(color: Colors.white)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: ElevatedButton( // botao voltar
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