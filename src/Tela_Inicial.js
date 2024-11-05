// src/Tela_Inicial
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Tela_Inicial.css';
import logo from './assets/LOGO.jpg';
import Header from './components/Header';  
import Footer from './components/Footer'; 

const Tela_Inicial = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelection = (role) => {
    navigate(`/login?role=${role}`);
  };

  const handleRoleSelectionLeitor = () => {
    navigate(`/menu`);
  };

  return (
    <div>
      {isLoading && (
        <div id="loading-screen">
          <p>Em breve você escolherá seu tipo de usuário...</p>
          <div className="balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            
          </div>
        </div>
      )}

      {!isLoading && (
        <>
        <div className="layout">
          <Header />
          
          <div className="modal-wrapper">
            <div className="title-modal">
              <h3>Escolha seu tipo de usuário</h3>
            </div>
          </div>

          <div className="container">
            <div className="role-selection-modal">
              <div className="role-selection">
                <h3>Funções</h3>
                <button onClick={() => handleRoleSelection('admin')}>Administrador</button>
                <button onClick={() => handleRoleSelection('operador')}>Operador</button>
                <h3>Visitante</h3>
                <button onClick={() => handleRoleSelectionLeitor()}>Apenas leitura</button>

                <p className="info-text">
                  Ao escolher APENAS LEITURA, você verá apenas seu perfil (privativo).
                  A visualização não terá funcionalidades reais de modificação.
                </p>
              </div>
            </div>
          </div>

          <Footer />
        </div>

        </>
      )}
    </div>
  );
};

export default Tela_Inicial;
