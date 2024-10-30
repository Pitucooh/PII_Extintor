import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Alterado para Routes
import Tela_Inicial from './Tela_Inicial';
import Login from './Login';
import Busca from './Busca'; 
import Relatorio from './Relatorio'; 
import Menu from './Menu';

const App = () => {
  return (
    <Router>
      <div>
        <Routes> {/* Usando Routes em vez de Switch */}
          <Route path="/" element={<Tela_Inicial/>} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/busca" element={<Busca />} /> 
          <Route path="/relatorio" element={<Relatorio />} /> 
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>   
    </Router>
  );
  
};

export default App;
