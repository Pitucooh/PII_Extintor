import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'exibeqr.dart'; // Import the exibeqr.dart file
import 'patrimoniodados.dart'; // Import the patrimoniodados.dart file

class TelaQRCode extends StatefulWidget {
  const TelaQRCode({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _TelaQRCodeState createState() => _TelaQRCodeState();
}

class _TelaQRCodeState extends State<TelaQRCode> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  bool isCameraActive = false;
  String qrText = '';
  String apiResponse = 'Aguardando resultado do QR Code...';
  bool showApiResponseButton = false;

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
      setState(() {
        qrText = scanData.code;
        // Navigate to exibeqr.dart with the scanned QR code data
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => ExibeQR(data: qrText)),
        );
      });
    });
  }

  void _searchPatrimonio(String patrimonio) {
    // Navigate to patrimoniodados.dart with the searched patrimonio
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PatrimonioDados(data: patrimonio, idEquipamento: '', linha: '', situacao: '', anotacoes: '',)),
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
          const SizedBox(height: 60),
          
          // Grey Box with Text
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
            width: 350,
            decoration: BoxDecoration(
              color: const Color(0xFF001789),
              borderRadius: BorderRadius.circular(12)
            ),
            child: const Center(
              child: Text(
                'Scaneie ou pesquise por patrimonio',
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
            flex: 3, // Increase the flex value to make it taller
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: isCameraActive
                    ? QRView(
                        key: qrKey,
                        onQRViewCreated: _onQRViewCreated,
                      )
                    : const Center(
                        child: Text('Pressione o botão para ativar a câmera')),
              ),
            ),
          ),
          const SizedBox(height: 20),
          
          // "Ou se preferir..." and Search Box
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
                      decoration: InputDecoration(
                        hintText: 'Digite o patrimônio...',
                        hintStyle: const TextStyle(), // Add padding to hint text
                        filled: true,
                        fillColor: Colors.grey[300],
                        contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10), // Increase the height and add padding
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: _searchPatrimonio, // Handle search on submit
                    ),
                    Positioned(
                      right: 0,
                      top: 0,
                      bottom: 0,
                      child: Container(
                        height: 60,
                        width: 80, // Increase the width of the button
                        decoration: BoxDecoration(
                          color: const Color(0xFF001789), // Blue color for the button
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.search, color: Colors.white),
                          onPressed: () {
                            // Ação do botão de pesquisa
                            _searchPatrimonio(qrText);
                          },
                        ),
                      ),
                    ),
                  ],
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
}