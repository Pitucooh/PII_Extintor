import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Armazenando 
    localStorage.setItem('role', role);
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
      <div className="content">
        <h3>Escolha seu tipo de usuário</h3>
        <div className="role-selection">
          <button onClick={() => handleRoleSelection('admin')}>Administrador</button>
          <button onClick={() => handleRoleSelection('operador')}>Operador</button>
          <button onClick={() => handleRoleSelection('leitura')}>Apenas leitura</button>
        </div>
        <p className="info-text">
          Ao escolher um tipo de usuário, você verá apenas seu perfil (privativo). A visualização não
          terá funcionalidades reais de modificação.
        </p>
      </div>
    </div>
  );
};

export default Login;
