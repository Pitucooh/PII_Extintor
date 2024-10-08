// src/Login.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role'); // Obtém o papel selecionado

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de login
    alert(`Logando como: ${role}`); // Exemplo de alerta com o papel
  };

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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Papel selecionado: {role}</p> {/* Exibe o papel selecionado */}
    </div>
  );
};

export default Login;
