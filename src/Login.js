import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Obtendo o role da URL
  const role = new URLSearchParams(location.search).get('role');

  const handleLogin = (e) => {
    e.preventDefault();

    if (registrationNumber && password) {
      // Salvar o role no localStorage
      localStorage.setItem('role', role);
      // Redirecionar para a página principal ou dashboard
      navigate(`/busca?role=${role}`);
    } else {
      alert("Por favor, insira o número de registro e a senha validos.");
    }
  };

  // const validateCPF = (cpf) => {
  //   const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  //   return cpfRegex.test(cpf);
  // };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Número de Registro:</label>
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CPF:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
