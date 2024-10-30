import React, { useState } from 'react';
import EquipamentosPorRegiao from './graphs/EquipamentosPorRegiao.js';
import ValidadeEquipamento from './graphs/ValidadeEquipamento.js';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './css/Relatorio.css'; // Arquivo CSS atualizado

const Relatorio = () => {
  return (
    <div className="layout">
      <Header />
      <Navbar />
      <div className='modal-wrapper' style={{paddingTop: '150px'}}> 
        <div className="title-modal">
            <h3>Relatórios</h3>
        </div>
      </div>
      <div className="container">
        <EquipamentosPorRegiao />
        <ValidadeEquipamento />
      </div>
      <Footer />
    </div>
  );
};

export default Relatorio;
