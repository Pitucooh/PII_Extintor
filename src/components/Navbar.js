// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';


const role = localStorage.getItem('role');

const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/menu">Início</Link>
          </li>
          <li>
            <Link to={`/busca?role=${role}`}>Equipamentos</Link>
          </li>
          <li>
            <Link>Estações</Link>
          </li>
          <li>
            <Link to="/relatorio">Relatórios</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
