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
    <div className="container">
      <Header></Header>
      <Navbar></Navbar>
      <Footer></Footer>
    </div>
  );
};

export default Menu;
