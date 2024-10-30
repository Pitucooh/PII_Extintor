// src/Tela_Inicial
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Menu.css';
import Header from './components/Header';  
import Footer from './components/Footer';
import Navbar from './components/Navbar.js'

const Menu = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="layout">
      <Header></Header>
      <Navbar></Navbar>
      <div className='modal-wrapper' style={{paddingTop: '150px'}}> 
        <div className="title-modal">
          <h3>Menu</h3>
        </div>
      </div>
      <div className="container">
        <h1>PlaceHolder</h1>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Menu;
