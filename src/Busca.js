import React, { useState, useRef, useEffect } from 'react';
import QRious from 'qrious'; // Importando a biblioteca QRious para gerar QR codes
import './css/busca.css'; // Importando o arquivo CSS para estilos
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 

const MySwal = withReactContent(Swal);

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
  const [setIsModalOpen] = useState(false);
  const [novoExtintor, setNovoExtintor] = useState({
    patrimonio: '',
    num_equip: '',
    tipo: '',
    capacidade: '',
    fabricante: '',
    data_fabricacao: '',
    data_validade: '',
    ultima_recarga: '',
    proxima_inspecao: '',
    status: '',
    observacoes: '',
  });

  const [novoLocal, setNovoLocal] = useState({
    setor: '',
    area: '',
    gerencia: '',
    predio: '',
    local: '',
    observacoes: '',
  });

  const role = localStorage.getItem('role'); // Obtendo o papel do localStorage

  //BUSCAR
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

//EDITAR
// Função para abrir o modal
const abrirModal = (item) => {
  setModalData(item);

  MySwal.fire({
    title: 'Editar Extintor',
    html: (
      <form id="form-edit">
        <input type="text" name="num_equip" placeholder="Número do Equipamento" />
        <input type="text" name="tipo" placeholder="Tipo" />
        <input type="text" name="capacidade" placeholder="Capacidade" />
        <input type="text" name="fabricante" placeholder="Código do Fabricante" />
        <input type="text" name="data_fabricacao" placeholder="Data de Fabricação" />
        <input type="text" name="data_validade" placeholder="Data de Validade" />
        <input type="text" name="ultima_recarga" placeholder="Última Recarga" />
        <input type="text" name="data_insp" placeholder="Próxima Inspeção" />
        <input type="text" name="status" placeholder="Status" />
        <input type="text" name="id_local" placeholder="ID de Localização" />
        <input type="text" name="observacao" placeholder="Observações" />
      </form>
    ),
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const form = document.getElementById('form-edit');
      const formData = new FormData(form);
      const updatedData = {};
      formData.forEach((value, key) => {
        updatedData[key] = value;
      });
      return { updatedData }; // Retorna os dados atualizados dentro de um objeto
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedData = result.value.updatedData; // Aqui obtemos os dados retornados
      handleEditSubmit(updatedData); // Chama a função com os dados atualizados
    }
  });
};

// Função para enviar os dados atualizados
const handleEditSubmit = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3002/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedData }), // Envia dentro de um objeto
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Detalhes do erro:', errorDetails);
      throw new Error('Erro ao atualizar item');
    }

    const result = await response.json();
    console.log('Dados atualizados:', result.message);

    setResultados(prevResultados => prevResultados.map(item => (item.patrimonio === updatedData.patrimonio ? { ...item, ...updatedData } : item))); // Use patrimonio para comparação
    MySwal.fire('Sucesso!', 'Dados atualizados com sucesso.', 'success');
  } catch (error) {
    console.error('Erro ao enviar dados atualizados:', error);
    MySwal.fire('Erro!', 'Não foi possível atualizar os dados.', 'error');
  }
};

// DELETAR
const handleDelete = async (patrimonio) => {
  // Confirmar a ação de cadastro com o usuário usando SweetAlert2
  const { isConfirmed } = await Swal.fire({
    title: 'Você tem certeza?',
    text: 'Deseja excluir este extintor?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Não',
  });

  if (!isConfirmed) return;

  try {
    // Enviar requisição DELETE para o servidor
    const response = await fetch('http://localhost:3002/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patrimonio }), // Passar o patrimônio do extintor a ser excluído
    });

    if (!response.ok) {
      throw new Error('Erro na exclusão');
    }        

    // Atualizar a lista de resultados após exclusão
    setResultados(resultados.filter((item) => item.patrimonio !== patrimonio)); // Filtrar pelo patrimônio

    // Exibir mensagem de sucesso
    await Swal.fire({
      title: 'Excluído!',
      text: 'O extintor foi excluído com sucesso.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error('Erro:', error);

    // Exibir mensagem de erro
    await Swal.fire({
      title: 'Erro!',
      text: 'Não foi possível excluir o extintor. Tente novamente.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

const handleChange = (e) => {
  const { name, value } = e.target;

  // Update novoExtintor state
  if (name in novoExtintor) {
    setNovoExtintor((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  } 
  // Update novoLocal state
  else if (name in novoLocal) {
    setNovoLocal((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  }
};

  //CADASTRAR
  const handleCadastroSubmit = async (event) => {
    event.preventDefault();
    const { isConfirmed } = await Swal.fire({
      title: 'Você tem certeza?',
      text: 'Deseja cadastrar este extintor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, cadastrar!',
      cancelButtonText: 'Não',
    });
  
    if (!isConfirmed) return;
  
    try {
      const response_1 = await fetch('http://localhost:3002/insertextintor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoExtintor),
      });
  
      const response_2 = await fetch('http://localhost:3002/insertlocal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoLocal),
      });
  
      if (!response_1.ok) {
        const errorData = await response_1.json(); 
        throw new Error(errorData.message || 'Erro ao cadastrar extintor');
      }
  
      if (!response_2.ok) {
        const errorData = await response_2.json(); 
        throw new Error(errorData.message || 'Erro ao cadastrar localização');
      }
  
      const result_1 = await response_1.json();
      const result_2 = await response_2.json();
  
      Swal.fire({
        title: 'Sucesso!',
        text: result_1.message || result_2.message, 
        icon: 'success',
        confirmButtonText: 'OK',
      });
  
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Swal.fire({
        title: 'Erro!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
    
  return (
    <div>
      <h1>Buscar extintor por patrimônio</h1>
      <p>Seu papel: {role}</p>
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
              <>
                <div><strong>Patrimônio:</strong> {item.patrimonio || 'Indisponível'}</div>
                <div><strong>Número do Equipamento:</strong> {item.num_equip || 'Indisponível'}</div>
                <div><strong>Tipo:</strong> {item.tipo || 'Indisponível'}</div>
                <div><strong>Capacidade:</strong> {item.capacidade || 'Indisponível'}</div>
                <div><strong>Código do Fabricante:</strong> {item.fabricante || 'Indisponível'}</div>
                <div><strong>Data de Fabricação:</strong> {item.data_fabricacao || 'Indisponível'}</div>
                <div><strong>Data de Validade:</strong> {item.data_validade || 'Indisponível'}</div>
                <div><strong>Última Recarga:</strong> {item.ultima_recarga || 'Indisponível'}</div>
                <div><strong>Próxima Inspeção:</strong> {item.data_insp || 'Indisponível'}</div>
                <div><strong>Status:</strong> {item.status || 'Indisponível'}</div>
                <div><strong>ID de Localização:</strong> {item.id_local || 'Indisponível'}</div>
                <div><strong>QR Code:</strong> {item.qr_code || 'Indisponível'}</div>
                <div><strong>Observações:</strong> {item.observacao || 'Indisponível'}</div>
              </>
            )}
            {!item.message && (
              <>
                {(role === 'admin' || role === 'operador') && (
                  <button onClick={() => abrirModal(item)}>Editar</button>
                )}
                {role === 'admin' && (
                  <button onClick={() => handleDelete(item.patrimonio)}>Excluir</button>
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
        name="patrimonio"
        placeholder="Patrimônio"
        value={novoExtintor.patrimonio}
        onChange={handleChange}
      />
      <input
        type="text"
        name="num_equip"
        placeholder="Número do Equipamento"
        value={novoExtintor.num_equip}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tipo"
        placeholder="Tipo"
        value={novoExtintor.tipo}
        onChange={handleChange}
      />
      <input
        type="text"
        name="capacidade"
        placeholder="Capacidade"
        value={novoExtintor.capacidade}
        onChange={handleChange}
      />
      <input
        type="text"
        name="fabricante"
        placeholder="Fabricante"
        value={novoExtintor.fabricante}
        onChange={handleChange}
      />
      <input
        type="text"
        name="data_fabricacao"
        placeholder="Data de Fabricação"
        value={novoExtintor.data_fabricacao}
        onChange={handleChange}
      />
      <input
        type="text"
        name="data_validade"
        placeholder="Data de Validade"
        value={novoExtintor.data_validade}
        onChange={handleChange}
      />
      <input
        type="text"
        name="ultima_recarga"
        placeholder="Última Recarga"
        value={novoExtintor.ultima_recarga}
        onChange={handleChange}
      />
      <input
        type="text"
        name="proxima_inspecao"
        placeholder="Próxima Inspeção"
        value={novoExtintor.proxima_inspecao}
        onChange={handleChange}
      />
      <input
        type="text"
        name="status"
        placeholder="Status"
        value={novoExtintor.status}
        onChange={handleChange}
      />
        <input
        type="text"
        name="observacoes"
        placeholder="Obersavações sobre o Extintor"
        value={novoExtintor.observacoes}
        onChange={handleChange}
      />
      {/* Campos de Localização */}
      <input
        type="text"
        name="localizacao.setor"
        placeholder="Setor"
        value={novoLocal.setor}
        onChange={handleChange}
      />
      <input
        type="text"
        name="localizacao.area"
        placeholder="Área"
        value={novoLocal.area}
        onChange={handleChange}
      />
      <input
        type="text"
        name="localizacao.gerencia"
        placeholder="Gerência"
        value={novoLocal.gerencia}
        onChange={handleChange}
      />
      <input
        type="text"
        name="localizacao.predio"
        placeholder="Prédio"
        value={novoLocal.predio}
        onChange={handleChange}
      />
      <input
        type="text"
        name="localizacao.local"
        placeholder="Local"
        value={novoLocal.local}
        onChange={handleChange}
      />
       <input
        type="text"
        name="localizacao.observacoes"
        placeholder="Obersavações sobre a Localização"
        value={novoLocal.observacoes}
        onChange={handleChange}
      />
      <button type="submit">Cadastrar Extintor</button>
    </form>
    </div>
  );
};

export default Busca;
