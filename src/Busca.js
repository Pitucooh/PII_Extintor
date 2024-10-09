// src/Busca.js
import React, { useState, useRef, useEffect } from 'react';
import QRious from 'qrious'; // Importando a biblioteca QRious para gerar QR codes
import './index.css'; // Importando o arquivo CSS para estilos

const QRCodeCanvas = ({ value }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      new QRious({
        element: canvasRef.current,
        value,
        size: 128,
      });
    }
  }, [value]);

  return <canvas ref={canvasRef}></canvas>;
};

const Busca = () => {
  const [patrimonio, setPatrimonio] = useState('');
  const [resultados, setResultados] = useState([]);
  const [modalData, setModalData] = useState(null);
  const role = localStorage.getItem('role'); // Obtendo o papel do localStorage
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoExtintor, setNovoExtintor] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3002/busca?patrimonio=${encodeURIComponent(patrimonio)}`);
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      const dados = await response.json();

      if (dados.length === 0) {
        setResultados([{ message: 'Nenhum extintor encontrado' }]);
      } else {
        setResultados(dados.filter(item => item.patrimonio === patrimonio));
      }
    } catch (error) {
      console.error('Erro:', error);
      setResultados([{ message: 'Erro ao buscar extintor' }]);
    }
  };

  const abrirModal = (item) => {
    setModalData(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = {};
    formData.forEach((value, key) => {
      updatedData[key] = value;
    });

    try {
      const response = await fetch(`http://localhost:3002/update/${modalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar item');
      }

      const result = await response.json();
      console.log('Dados atualizados:', result.message);
      closeModal();

      setResultados(prevResultados => prevResultados.map(item => (item.id === modalData.id ? { ...item, ...updatedData } : item)));
    } catch (error) {
      console.error('Erro ao enviar dados atualizados:', error);
    }
  };

  const handleCadastroSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3002/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoExtintor),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar extintor');
      }

      const result = await response.json();
      console.log('Extintor cadastrado:', result.message);
      setNovoExtintor({});
    } catch (error) {
      console.error('Erro ao cadastrar extintor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir este extintor?")) {
      try {
        const response = await fetch(`http://localhost:3002/delete/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erro ao excluir extintor');
        }

        const result = await response.json();
        console.log('Extintor excluído:', result.message);
        setResultados(resultados.filter(item => item.id !== id));

      } catch (error) {
        console.error('Erro ao excluir extintor:', error);
      }
    }
  };

  return (
    <div>
      <h1>Buscar extintor por patrimônio</h1>

      <form id="formBusca" onSubmit={handleSubmit}>
        <input
          type="text"
          id="patrimonio"
          placeholder="Digite o patrimônio"
          value={patrimonio}
          onChange={(e) => setPatrimonio(e.target.value)}
          required
        />
        <button type="submit">Buscar</button>
      </form>

      <div id="resultados">
        {resultados.map((item, index) => (
          <div key={index} className="resultado-item">
            {item.message ? (
              <p>{item.message}</p>
            ) : (
              Object.entries(item).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value || 'não disponível'}<br />
                </div>
              ))
            )}

            {!item.message && (
              <>
                <button onClick={() => abrirModal(item)}>Editar</button>
                {role !== 'Operador' && ( // Condição para mostrar o botão de excluir
                  <button onClick={() => handleDelete(item.id)}>Excluir</button>
                )}
                {item.num_equip && <QRCodeCanvas value={item.num_equip} />}
              </>
            )}
          </div>
        ))}
      </div>

      <h2>Cadastrar Novo Extintor</h2>
      <form onSubmit={handleCadastroSubmit}>
        <input
          type="text"
          placeholder="Patrimônio"
          value={novoExtintor.patrimonio || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, patrimonio: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Número do Equipamento"
          value={novoExtintor.num_equip || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, num_equip: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tipo"
          value={novoExtintor.tipo || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, tipo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Capacidade"
          value={novoExtintor.capacidade || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, capacidade: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Código_Fabricante"
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Data_Fabricação"
          value={novoExtintor.data_fabricacao || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, data_fabricacao: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Data_Validade"
          value={novoExtintor.data_validade || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, data_validade: e.target.value })}
          required
        /> 
        <input
          type="text"
          placeholder="Última_Recarga"
          value={novoExtintor.ultima_recarga || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, ultima_recarga: e.target.value })}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Busca;
