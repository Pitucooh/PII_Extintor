import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:postgres/postgres.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: QRViewExample(),
    );
  }
}

Future<void> _connectToDatabase() async {
  try {
    final conn = await Connection.open(
      Endpoint(
        host: '35.198.43.67',
        username: 'postgres',
        database: 'postgres',
        password: '5yQD\$ee7jHBsj&Tp',
        port: 5432,
      ),
      settings: ConnectionSettings(sslMode: SslMode.disable),
    );
    print('Conexão com o banco de dados estabelecida!');
  } catch (e) {
    print('Erro ao conectar ao banco de dados: $e');
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('QR Code Scanner')),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 5,
            child: isCameraActive
                ? QRView(
                    key: qrKey,
                    onQRViewCreated: _onQRViewCreated,
                  )
                : Center(child: Text('Pressione o botão para ativar a câmera')),
          ),
          Expanded(
            flex: 1,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Resultado do QR code: $qrText'),
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
                  child: Text(
                      isCameraActive ? 'Desativar Câmera' : 'Ativar Câmera'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      setState(() {
        qrText = scanData.code;
      });
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}
