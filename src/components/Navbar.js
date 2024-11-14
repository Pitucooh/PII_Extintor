import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    // Acessando o 'role' diretamente do localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole); // Atualiza o estado com o role
    }
  }, []);

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/menu">Início</Link>
          </li>
          <li>
            {/* Passando o role como parâmetro na URL */}
            <Link to={`/busca?role=${role}`}>Buscas</Link>
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
