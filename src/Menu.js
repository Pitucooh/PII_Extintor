// src/Tela_Inicial
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Menu.css';
import logo from './assets/LOGO.jpg';

const Tela_Inicial = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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

          <div className="title-modal">
            <h3>Login de usuário</h3>
          </div>
          
          <div className="login-container">
            <form onSubmit={handleLogin}>
              <div>
                
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                
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

export default Menu;
