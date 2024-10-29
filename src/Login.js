// src/Tela_Inicial
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Login.css';
import logo from './assets/LOGO.jpg';

const Tela_Inicial = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const role = new URLSearchParams(location.search).get('role');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (registrationNumber && password) {
      localStorage.setItem('role', role);
      navigate(`/busca?role=${role}`);
    } else {
      alert("Por favor, insira o número de registro e a senha válidos.");
    }
  };

  return (
    <div className="container">
      {isLoading ? (
        <div id="loading-screen">
          <p>Carregando...</p>
          <div className="balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="header">
            <div className="logo"></div>
            <div className="title">
              <h1>Metrô SP - Gestão de Equipamentos</h1>
              <h1>de Combate a Incêndio</h1>
            </div>
            <div className="company">
              <img src={logo} alt="Logo" />
            </div>
          </div>

          
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

          <footer style={{
            backgroundColor: '#878787',
            color: '#fff',
            textAlign: 'center',
            padding: '10px 20px',
            fontSize: '14px',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
          }}>
            <p>&copy; 2024 - Todos os direitos reservados.</p>
            <p>
              Contato: <a href="#" style={{ color: '#fff', textDecoration: 'underline' }}>metrocptm.com</a>
            </p>
          </footer>
        </>
      )}
    </div>
  );
};

export default Tela_Inicial;
