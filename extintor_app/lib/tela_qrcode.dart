import 'dart:io';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'exibeqr.dart'; // Substitua por seu arquivo específico, se necessário
import 'operador/patrimoniodados.dart'; // Substitua por seu arquivo específico, se necessário
import 'admin/editapatrimonio.dart'; // Certifique-se de que a classe EditaPatrimonio está sendo importada corretamente
import 'user_session.dart'; // Supondo que você tem um arquivo que gerencia a sessão do usuário

class TelaQRCode extends StatefulWidget {
  const TelaQRCode({super.key});

  @override
  _TelaQRCodeState createState() => _TelaQRCodeState();
}

class _TelaQRCodeState extends State<TelaQRCode> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  String qrText = '';
  String scanStatus = 'Pronto para escanear';
  bool isScanning = false;

  // Obtendo o tipo de usuário diretamente do UserSession
  String get role =>
      UserSession.getUserType() as String? ??
      ''; // Se for nulo, retorna uma string vazia

  @override
  void reassemble() {
    super.reassemble();
    if (controller != null) {
      if (Platform.isAndroid) {
        controller!.pauseCamera();
      }
      controller!.resumeCamera();
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });

    controller.scannedDataStream.listen((scanData) {
      if (!isScanning) {
        setState(() {
          isScanning = true;
          scanStatus = 'Escaneando QR Code...';
          qrText = scanData.code ?? '';
        });

        // Navega para a tela de exibição do QR Code
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => EditaPatrimonio(patrimonio: qrText)),
        ).then((_) {
          // Reinicia o estado após retornar da tela
          setState(() {
            isScanning = false;
            scanStatus = 'Pronto para escanear';
          });
        });
      }
    });
  }

  void _searchPatrimonio(String patrimonio) async {
    String? userType = await UserSession.getUserType();

    if (userType == 'admin') {
      // Navegar para a tela de edição de patrimônio (admin)
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => EditaPatrimonio(
            patrimonio: patrimonio,
          ),
        ),
      );
    } else if (userType == 'operador') {
      // Navegar para a tela de dados do patrimônio (operador)
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => PatrimonioDados(
            data: patrimonio, // Enviando o patrimônio escaneado ou digitado
            idEquipamento: '', // Valores vazios ou padrão
            linha: '',
            situacao: '',
            anotacoes: '',
          ),
        ),
      );
    } else {
      // Caso o tipo de usuário não seja nem admin nem operador
      _showDialog('Erro', 'Usuário sem permissão para editar.');
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
  final TextEditingController _controller = TextEditingController();

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
          const SizedBox(height: 60),
          // Grey Box with Text
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
            width: 350,
            decoration: BoxDecoration(
              color: const Color(0xFF001789),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: Text(
                'Scaneie ou pesquise por patrimônio',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          // QR Code Scanner
          Expanded(
            flex: 3,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12), // Bordas arredondadas
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      QRView(
                        key: qrKey,
                        onQRViewCreated: _onQRViewCreated,
                      ),
                      Positioned(
                        bottom: 10,
                        child: Text(
                          scanStatus,
                          style: TextStyle(
                            color: isScanning ? Colors.green : Colors.red,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          // Search Box
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0),
            child: Column(
              children: [
                const Text(
                  'Ou se preferir...',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),
                Stack(
                  children: [
                    TextField(
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: 'Digite o patrimônio...',
                        filled: true,
                        fillColor: Colors.grey[300],
                        contentPadding: const EdgeInsets.symmetric(
                          vertical: 20,
                          horizontal: 10,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      top: 0,
                      bottom: 0,
                      child: Container(
                        height: 60,
                        width: 80,
                        decoration: BoxDecoration(
                          color: const Color(0xFF001789),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.search, color: Colors.white),
                          onPressed: () {
                            qrText = _controller
                                .text; // Armazena o texto digitado na variável qrcode
                            print("Texto digitado: $qrText");
                            _searchPatrimonio(
                                qrText); // Passando o texto escaneado ou digitado para a busca
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
