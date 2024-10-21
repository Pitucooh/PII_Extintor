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
          <h1>Metrô SP - Gestão de equipamentos de combate a incêndio</h1>
        </div>
        <div className="company">
          <h2>CPTM</h2>
          <p>Identificação</p>
        </div>
      </div>
      <div className="title-modal">
        <h3>Escolha seu tipo de usuário</h3>
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
        
      </div>
  );
};

export default Tela_Inicial;
