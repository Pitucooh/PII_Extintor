import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: QRViewExample(),
    );
  }
}

class QRViewExample extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _QRViewExampleState();
}

class _QRViewExampleState extends State<QRViewExample> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  String? qrText;
  bool isCameraActive = false;
  String apiResponse = 'Aguardando resultado do QR Code...';
  bool showApiResponseButton = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('QR Code Scanner')),
      body: SafeArea(
        child: Column(
          children: <Widget>[
            Expanded(
              flex: 5,
              child: isCameraActive
                  ? QRView(
                      key: qrKey,
                      onQRViewCreated: _onQRViewCreated,
                    )
                  : Center(
                      child: Text('Pressione o botão para ativar a câmera')),
            ),
            Expanded(
              flex: 3,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Resultado do QR Code: $qrText'),
                    SizedBox(height: 10),
                    if (showApiResponseButton)
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  ApiResponseScreen(apiResponse),
                            ),
                          );
                        },
                        child: Text('Ver Detalhes da Resposta'),
                      ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          if (isCameraActive) {
                            controller?.pauseCamera();
                          } else {
                            controller?.resumeCamera();
                          }
                          isCameraActive = !isCameraActive;
                        });
                      },
                      child: Text(isCameraActive
                          ? 'Desativar Câmera'
                          : 'Ativar Câmera'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _fetchData(String qrKey) async {
    final response = await http
        .get(Uri.parse('http://10.2.128.150:3002/busca?patrimonio=$qrKey'));

    if (response.statusCode == 200 && response.body.isNotEmpty) {
      setState(() {
        apiResponse = response.body;
        showApiResponseButton = true;
      });
    } else {
      setState(() {
        apiResponse = 'Nenhuma resposta encontrada para o QR Code.';
        showApiResponseButton = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    controller?.scannedDataStream.listen((scanData) {
      setState(() {
        qrText = scanData.code;
      });
      if (qrText != null && qrText!.isNotEmpty) {
        _fetchData(qrText!);
      }
    });
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      setState(() {
        qrText = scanData.code;
      });
      if (qrText != null && qrText!.isNotEmpty) {
        _fetchData(qrText!);
      }
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}

class ApiResponseScreen extends StatelessWidget {
  final String apiResponse;

  ApiResponseScreen(this.apiResponse);

  String prettyJson(String jsonString) {
    try {
      final jsonObject = jsonDecode(jsonString);
      final prettyString =
          const JsonEncoder.withIndent('  ').convert(jsonObject);
      return prettyString;
    } catch (e) {
      // Caso o JSON esteja inválido, apenas retorna a string original.
      return jsonString;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Detalhes da Resposta')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                prettyJson(apiResponse),
                style: TextStyle(fontSize: 14, fontFamily: 'Courier'),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
