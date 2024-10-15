// src/Login.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpfError, setCpfError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Importando useLocation

  // Captura o role da URL
  const params = new URLSearchParams(location.search);
  const role = params.get('role');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você pode adicionar a validação do CPF
    // if (validateCPF(password)) {
      // Armazena o papel no localStorage
      localStorage.setItem('role', role);
      navigate(`/busca?role=${role}`);
    // } else {
    //   setCpfError('CPF inválido. Por favor, insira um CPF no formato válido.');
    // }
  };

  // const validateCPF = (cpf) => {
  //   const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  //   return cpfRegex.test(cpf);
  // };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Preencha seus dados</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Número de registro
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            CPF
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setCpfError(''); // Limpa o erro quando o usuário começa a digitar
              }}
              required
            />
          </label>
          {cpfError && <p style={{ color: 'red' }}>{cpfError}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
