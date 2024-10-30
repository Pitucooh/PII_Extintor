// src/Tela_Inicial
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Login.css';
import logo from './assets/LOGO.jpg';
import user from './assets/user.png'; 
import Header from './components/Header';
import Footer from './components/Footer';


const Tela_Inicial = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (registrationNumber && password) {
      const role = new URLSearchParams(location.search).get('role');
      try {
        const response = await fetch(`http://localhost:3002/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            n_registro: registrationNumber, // Usar CPF como número de registro
            cpf: password,
            role, // Envia o papel na requisição
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Armazenar o role do usuário no localStorage
          localStorage.setItem('role', data.user.status);
          // Redirecionar para a página do menu
          navigate(`/menu?role=${data.user.status}`);
        } else {
          alert(data.message || 'Erro ao realizar login.');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
      }
    } else {
      alert("Por favor, insira o número de registro e a senha válidos.");
    }
  };  

  return (
    <div className="layout">
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
          <Header></Header>
          <div className="modal-wrapper">
            <div className="title-modal">
              <h3>Login de usuário</h3>
            </div>
          </div>
          <div className="container">
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
                  <img src={user} alt="Input Icon" className="input-icon" />
                </div>
                <button type="submit">Entrar</button>
              </form>
            </div>

            <Footer></Footer>
          </div>
        </>
      )}
    </div>
  );
};

export default Tela_Inicial;
