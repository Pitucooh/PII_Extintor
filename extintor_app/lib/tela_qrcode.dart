import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class TelaQRCode extends StatefulWidget {
  const TelaQRCode({super.key});

  @override
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
        // Handle the scanned QR code data
      });
    });
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
          
          // Buttons
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      isCameraActive = !isCameraActive;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey[300],
                    padding: const EdgeInsets.symmetric(vertical: 25),
                    textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12), // Rounded corners
                    ),
                    minimumSize: const Size(double.infinity, 80), // Increased button size
                  ),
                  child: const Text('Escanear', style: TextStyle(color: Colors.black)),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey[300],
                    padding: const EdgeInsets.symmetric(vertical: 25),
                    textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12), // Rounded corners
                    ),
                    minimumSize: const Size(200, 80), // Smaller button width
                  ),
                  child: const Text('Voltar', style: TextStyle(color: Colors.black)),
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