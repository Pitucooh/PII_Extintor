// src/Tela_Inicial
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Tela_Inicial.css';

const Tela_Inicial = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a loading delay of 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelection = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="container">
      {isLoading && (
        <div id="loading-screen">
          <p>Estamos carregando a tela de login...</p>
          <div className="balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="header">
            <div className="logo"></div>
            <div className="title">
              <h1>Metrô SP - Gestão de equipamentos</h1>
              <h1>de combate a incêndio</h1>
            </div>
            <div className="company">
              <img src="./css/logo.JPG" alt="Logo" />
            </div>
          </div>
          <div className="title-modal">
            <h3>Escolha seu tipo de usuário</h3>
          </div>

          <div className="light-blue-modal">
          </div>

          <div className="role-selection-modal">
            <div className="role-selection">
              <h3>Funções</h3>
              <button onClick={() => handleRoleSelection('admin')}>Administrador</button>
              <button onClick={() => handleRoleSelection('operador')}>Operador</button>
              <h3>Visitante</h3>
              <button onClick={() => handleRoleSelection('leitura')}>Apenas leitura</button>

              <p className="info-text">
                Ao escolher APENAS LEITURA, você verá apenas seu perfil (privativo). A visualização não
                terá funcionalidades reais de modificação.
              </p>
            </div>
          </div>

          <div className="light-blue-modal">
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
              Contact us: <a href="#" style={{ color: '#fff', textDecoration: 'underline' }}>metrocptm.com</a>
            </p>
          </footer>
        </>
      )}
    </div>
  );
};

export default Tela_Inicial;
