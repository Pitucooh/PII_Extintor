import React, { useState } from 'react';

const Relatorio = () => {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [patrimonio, setPatrimonio] = useState('');
  const [historico, setHistorico] = useState([]);
  const [error, setError] = useState('');

  const handle_Manut_Ext = async (e) => {
    e.preventDefault();
    console.log('Formulário enviado!');
    setError(''); 
  
    try {
      const response = await fetch(`http://localhost:3002/manutencao/${id}`);
      console.log(response); 
      if (!response.ok) {
        throw new Error('Registro não encontrado');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  const handle_Ext_Manut = async (e) => {
    e.preventDefault();
    console.log('Formulário enviado!');
    setError(''); 
    
    try {
        const response = await fetch(`http://localhost:3002/historico/${patrimonio}`);
        if (!response.ok) {
          throw new Error('Registro não encontrado');
        }
        const results = await response.json();
        setHistorico(results); // Armazena o histórico retornado
    } catch (err) {
        setError(err.message);
        setHistorico([]);
    }
  };

  return (
    <div>
      <h1>Extintores por Manutenção</h1>
      <form onSubmit={(e) => {
        handle_Manut_Ext(e);
        }}>
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
          <h3>Detalhes da Manutenção:</h3>
          <p>ID: {data.id_manutencao}</p>
          <p>Patrimonio: {data.patrimonio}</p>
          <p>Data: {data.data_manu}</p>
          <p>Descrição: {data.desc}</p>
          <p>Responsável: {data.resp}</p>
          <p>Observações: {data.observacoes}</p>
        </div>
      )}

      <div>
      <h1>Manutenções por Extintor</h1>
      <div>
      <form onSubmit={(e) => {handle_Ext_Manut(e);}}>
        <label>
          Patrimonio do Extintor:
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
      {historico.length > 0 && (
        <ul>
          {historico.map((item) => (
            <li key={item.id_manutencao}>
              {/* Exiba os detalhes da manutenção conforme necessário */}
              {JSON.stringify(item)} {}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
    </div>
  );
};

export default Relatorio;
