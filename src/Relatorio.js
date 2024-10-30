import React, { useState } from 'react';
import EquipamentosPorRegiao from './graphs/EquipamentosPorRegiao.js';
import ValidadeEquipamento from './graphs/ValidadeEquipamento.js';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './css/Relatorio.css'; // Arquivo CSS atualizado

const Relatorio = () => {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [patrimonio, setPatrimonio] = useState('');
  const [historico, setHistorico] = useState([]);
  const [error, setError] = useState('');

  const handle_Manut_Ext = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`http://localhost:3002/manutencao/${id}`);
      if (!response.ok) throw new Error('Registro não encontrado');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  const handle_Ext_Manut = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`http://localhost:3002/historico/${patrimonio}`);
      if (!response.ok) throw new Error('Registro não encontrado');
      const results = await response.json();
      setHistorico(results);
    } catch (err) {
      setError(err.message);
      setHistorico([]);
    }
  };

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
        <h1>Extintores por Manutenção</h1>
        <form onSubmit={handle_Manut_Ext}>
          <label>
            ID da Manutenção:
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </label>
          <button type="submit">Buscar</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {data && (
          <div>
            <h3>Detalhes da Manutenção de ID {data.id_manutencao}:</h3>
            <ul>
              <li>
                <p>Patrimônio: {data.patrimonio}</p>
                <p>Data: {data.data_manu}</p>
                <p>Descrição: {data.desc}</p>
                <p>Responsável: {data.resp}</p>
                <p>Observações: {data.observacoes}</p>
              </li>
            </ul>
          </div>
        )}

        <h1>Manutenções por Extintor</h1>
        <form onSubmit={handle_Ext_Manut}>
          <label>
            Patrimônio do Extintor:
            <input
              type="text"
              value={patrimonio}
              onChange={(e) => setPatrimonio(e.target.value)}
              required
            />
          </label>
          <button type="submit">Buscar Histórico</button>
        </form>

        {error && <p>{error}</p>}
        {historico && historico.manutencoes && historico.manutencoes.length > 0 ? (
          <div>
            <h2>Histórico de Manutenções - Patrimônio {historico.patrimonio}</h2>
            <h3>Total de Manutenções: {historico.manutencoes.length}</h3>  
            <ul>
              {historico.manutencoes.map((item) => (
                <li key={item.manutencaoId}>
                  
                  <p><strong>ID:</strong> {item.manutencaoId}</p>
                  <p><strong>Data:</strong> {item.data}</p>
                  <p><strong>Responsável:</strong> {item.responsavel}</p>
                  <p><strong>Descrição:</strong> {item.descricao}</p>
                  <p><strong>Observações:</strong> {item.observacoes}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !error && <p>Nenhum dado encontrado</p>
        )}

        <EquipamentosPorRegiao />
        <ValidadeEquipamento />
      </div>
      <Footer />
    </div>
  );
};

export default Relatorio;
