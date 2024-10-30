// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/menu">Início</Link>
          </li>
          <li>
            <Link to="/busca">Equipamentos</Link>
          </li>
          <li>
            <Link>Estações</Link>
          </li>
          <li>
            <Link to="/relatorio">Relatórios</Link>
          </li>
        </ul>
      </nav>
      <div className="title-modal">
        <h3>Menu</h3>
      </div>
    </div>
  );
};

export default Navbar;
