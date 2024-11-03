import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Login.css';
import user from './assets/user.png'; 
import Header from './components/Header';
import Footer from './components/Footer';

const Tela_Inicial = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false); // estado para controlar o modal
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const validateCPF = (cpf) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateCPF(password)) {
      setErrorMessage('CPF inválido. Use o formato xxx.xxx.xxx-xx.');
      setShowErrorModal(true);
      return;
    }

    const role = new URLSearchParams(location.search).get('role');
    try {
      const response = await fetch(`http://localhost:3002/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          n_registro: registrationNumber,
          cpf: password,
          role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('role', data.user.status);
        navigate(`/menu?role=${data.user.status}`);
      } else {
        setErrorMessage(data.message || 'Credenciais inválidas.');
        setShowErrorModal(true); // exibe o modal
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Erro no servidor. Tente novamente mais tarde.');
      setShowErrorModal(true); // exibe o modal
    }
  };

  const closeModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="layout">
      {isLoading ? (
        <div id="loading-screen">
          <p>Te redirecionando...</p>
          <div className="balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <div className="modal-wrapper">
            <div className="title-modal">
              <h3>Login de usuário</h3>
            </div>
          </div>
          <div className="container">
            <div className="login-container">
              <div className="login-header">
                <h2>Login de usuário em "Metrô de São Paulo"</h2>
              </div>
              <div className="login-content">
                <div className="user-icon">
                  <img src={user} alt="Ícone de usuário" className="user-image" />
                </div>
                <form onSubmit={handleLogin} className="login-form">
                  <div className="input-group">
                    <label>Número de registro</label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>CPF</label>
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
            </div>
          </div>
          <Footer />
          
          {showErrorModal && (
            <div className="error-modal">
              <div className="modal-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <p>{errorMessage }</p>
                <button onClick={closeModal} className="retry-button">Tentar novamente</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tela_Inicial;
