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

const App = () => {
  // Estados para gerenciar os dados
  const [patrimonio, setPatrimonio] = useState(''); // Estado para armazenar o patrimônio digitado
  const [resultados, setResultados] = useState([]); // Estado para armazenar os resultados da busca
  const [modalData, setModalData] = useState(null); // Estado para armazenar os dados do item a ser editado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal
  const [novoExtintor, setNovoExtintor] = useState({}); // Estado para armazenar dados do novo extintor

  // Função para tratar o envio do formulário de busca
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fazendo a requisição para buscar os dados
      const response = await fetch(`http://localhost:3002/busca?patrimonio=${encodeURIComponent(patrimonio)}`);
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      const dados = await response.json();

      // Verificando se há resultados
      if (dados.length === 0) {
        setResultados([{ message: 'Nenhum extintor encontrado' }]);
      } else {
        setResultados(dados);
      }
    } catch (error) {
      console.error('Erro:', error);
      setResultados([{ message: 'Erro ao buscar extintor' }]);
    }
  };

  // Função para abrir o modal de edição
  const abrirModal = (item) => {
    setModalData(item); // Armazenando os dados do item a ser editado
    setIsModalOpen(true); // Abrindo o modal
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para tratar o envio do formulário de edição
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
      closeModal(); // Fecha o modal após salvar as alterações

      // Opcional: Atualizar a lista de resultados após a edição
      // Você pode precisar fazer uma nova busca ou atualizar o estado local
    } catch (error) {
      console.error('Erro ao enviar dados atualizados:', error);
    }
  };

  // Função para tratar o envio do formulário de cadastro
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
      // Opcional: Você pode limpar o estado do novo extintor ou atualizar a lista
      setNovoExtintor({}); // Limpa o formulário após o envio
    } catch (error) {
      console.error('Erro ao cadastrar extintor:', error);
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
          onChange={(e) => setPatrimonio(e.target.value)} // Atualizando o estado ao digitar
          required
        />
        <button type="submit">Buscar</button>
      </form>

      <div id="resultados">
        {resultados.map((item, index) => (
          <div key={index} className="resultado-item">
            {item.message ? (
              <p>{item.message}</p> // Mensagem quando não há resultados
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
                {item.num_equip && <QRCodeCanvas value={item.num_equip} />}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Formulário para cadastrar um novo extintor */}
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
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Data_Validade"
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        /> 
        <input
          type="text"
          placeholder="Última_Recarga"
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        /> 
         <input
          type="text"
          placeholder="Próxima_Inspeção"
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Status"
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        />     
        <input
          type="text"
          placeholder="ID_Localização"
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        />  
           <input
          type="text"
          placeholder="Observações"
          value={novoExtintor.fabricante || ''}
          onChange={(e) => setNovoExtintor({ ...novoExtintor, fabricante: e.target.value })}
          required
        />         
        <button type="submit">Cadastrar Extintor</button>
      </form>

      {/* Modal para edição */}
      {isModalOpen && (
        <div id="modal" onClick={closeModal}> {/* Adicionado onClick para fechar ao clicar fora */}
          <div id="modalContent" onClick={(e) => e.stopPropagation()}> {/* Impede o fechamento ao clicar no conteúdo */}
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Editar Informações</h2>
            <form id="formEditar" onSubmit={handleEditSubmit}>
              <div id="camposEdicao">
                {modalData && Object.entries(modalData).map(([key, value]) => (
                  <div key={key}>
                    <label>{key}:</label>
                    <input type="text" name={key} defaultValue={value || ''} /><br />
                  </div>
                ))}
              </div>
              <button type="submit">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
