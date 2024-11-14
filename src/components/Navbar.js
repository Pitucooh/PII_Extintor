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
            <Link to="/menu"><strong>Início</strong></Link>
          </li>
          <li>
            {/* Passando o role como parâmetro na URL */}
            <Link to={`/busca?role=${role}`}><strong>Equipamentos</strong></Link>
          </li>
          <li>
            <Link to="/relatorio"><strong>Relatórios</strong></Link>  
          </li>     
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
