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
                    Text(
                      'Resposta da API: $apiResponse',
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 20),
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

class ApiResponseScreen extends StatefulWidget {
  final String apiResponse;

  ApiResponseScreen(this.apiResponse);

  @override
  _ApiResponseScreenState createState() => _ApiResponseScreenState();
}

class _ApiResponseScreenState extends State<ApiResponseScreen> {
  Map<String, TextEditingController> controllers = {};

  @override
  void initState() {
    super.initState();
    _initializeControllers();
  }

  void _initializeControllers() {
    try {
      final dataList = jsonDecode(widget.apiResponse);
      if (dataList is List && dataList.isNotEmpty) {
        final data = dataList[0] as Map<String, dynamic>;
        data.forEach((key, value) {
          controllers[key] = TextEditingController(text: value?.toString());
        });
      }
    } catch (e) {
      print("Erro ao processar JSON: $e");
    }
  }

  @override
  void dispose() {
    controllers.forEach((key, controller) {
      controller.dispose();
    });
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Detalhes da Resposta')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              ...controllers.entries.map((entry) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: TextField(
                    controller: entry.value,
                    decoration: InputDecoration(
                      labelText: entry.key,
                      border: OutlineInputBorder(),
                    ),
                  ),
                );
              }).toList(),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  // Logica para modificar ainda será implementada
                  print(
                      "Modificações feitas: ${controllers.values.map((e) => e.text).toList()}");
                },
                child: Text('Modificar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
