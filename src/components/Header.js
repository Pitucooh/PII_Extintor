// src/components/Header.js
import React from 'react';
import '../css/Header.css'; // Estilos específicos para o Header
import logo from '../assets/LOGO.jpg'; // Ajuste o caminho conforme necessário

const Header = () => {
  return (
    <header className="header"> {/* Use o elemento <header> para semântica */}
      <div className="logo"></div>
      <div className="title">
        <h1>Metrô SP - Gestão de Equipamentos</h1>
        <h1>de Combate a Incêndio</h1>
      </div>
      <div className="company">
        <img src={logo} alt="Logo" />
      </div>
    </header>
  );
};

export default Header;
