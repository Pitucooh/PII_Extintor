// src/Tela_Inicial
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Tela_Inicial.css';

const Tela_Inicial = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate(`/login?role=${role}`); 
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo"></div>
        <div className="title">
          <h1>Metrô SP - Gestão de equipamentos </h1>
          <h1>de combate a incêndio</h1>
        </div>
        <div className="company">
          <h2>CPTM</h2>
          <p>Identificação</p>
        </div>
      </div>
      <div className="title-modal">
        <h3>Escolha seu tipo de usuário</h3>
      </div>

    
      <div className="light-blue-modal">
    <p>Este é o modal azul claro, posicionado atrás do modal principal.</p>
  </div>

  <div className="role-selection-modal">
    <div className="role-selection">
      <button onClick={() => handleRoleSelection('admin')}>Administrador</button>
      <button onClick={() => handleRoleSelection('operador')}>Operador</button>
      <button onClick={() => handleRoleSelection('leitura')}>Apenas leitura</button>

      <p className="info-text">
        Ao escolher um tipo de usuário, você verá apenas seu perfil (privativo). A visualização não
        terá funcionalidades reais de modificação.
      </p>
    </div>
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
              <div>
                <a href="https://facebook.com" target="_blank" style={{ color: '#fff', margin: '0 10px' }}>Facebook</a>
                <a href="https://twitter.com" target="_blank" style={{ color: '#fff', margin: '0 10px' }}>Twitter</a>
                <a href="https://instagram.com" target="_blank" style={{ color: '#fff', margin: '0 10px' }}>Instagram</a>
              </div>
    </footer>



      </div>
  );
};

export default Tela_Inicial;
