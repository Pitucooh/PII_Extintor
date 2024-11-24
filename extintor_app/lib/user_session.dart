class UserSession {
  static String? _userType;

  // Salva o tipo de usuário
  static Future<void> setUserType(String userType) async {
    _userType = userType;
  }

  // Recupera o tipo de usuário
  static Future<String?> getUserType() async {
    return _userType;
  }
}