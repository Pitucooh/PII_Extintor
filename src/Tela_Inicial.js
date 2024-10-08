// src/Tela_Inicial
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tela_Inicial = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login?role=${role}`); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Selecione seu papel</h2>
      <button
        style={buttonStyle}
        onClick={() => handleRoleSelect('Administrador')}
      >
        Administrador
      </button>
      <button
        style={buttonStyle}
        onClick={() => handleRoleSelect('Operador')}
      >
        Operador
      </button>
      <button
        style={buttonStyle}
        onClick={() => handleRoleSelect('Apenas Leitura')}
      >
        Apenas Leitura
      </button>
    </div>
  );
};

const buttonStyle = {
  width: '200px',
  height: '60px',
  fontSize: '18px',
  margin: '10px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

export default Tela_Inicial;
