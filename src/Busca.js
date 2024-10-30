import React, { useState, useRef, useEffect } from 'react';
import QRious from 'qrious'; // Importando a biblioteca QRious para gerar QR codes
import './css/busca.css'; // Importando o arquivo CSS para estilos
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; 
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';  
import Footer from './components/Footer';
import Navbar from './components/Navbar';

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
  const [dadosEditados, setDadosEditados] = useState(null);
  const [predio, setPredio] = useState(''); 
  const [resultadosPredio, setResultadosPredio] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const navigate = useNavigate(); // Inicializa o hook
  const handleNavigate = () => {
    navigate('/Relatorio'); // Redireciona para outra página
  };

  const role = localStorage.getItem('role'); // Obtendo o papel do localStorage

  //--------------------------------------------------BUSCAR EXTINTOR----------------------------------------------------------------

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

  //--------------------------------------------------BUSCAR LOCAL----------------------------------------------------------------

  const handleBuscaLocalizacao = async (event) => {
    event.preventDefault();

    // Manipular o valor do prédio para remover espaços e tornar maiúsculas
    const predioLimpo = predio.trim().toUpperCase();

    try {
      const response = await fetch(`http://localhost:3002/predio?predio=${encodeURIComponent(predioLimpo)}`);
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const dados = await response.json();
      console.log(dados); // Para verificar o que está sendo retornado

      if (!Array.isArray(dados) || dados.length === 0) {
        setResultadosPredio([{ message: 'Nenhum local encontrado' }]); // Mensagem somente se não houver dados
      } else {
        // Filtrar resultados usando o valor manipulado
        const resultadosFiltrados = dados.filter(item => item.predio && item.predio.toUpperCase() === predioLimpo);

        // Remove duplicatas (se necessário)
        const resultadosUnicos = Array.from(new Set(resultadosFiltrados.map(item => item.id_local)))
          .map(id => resultadosFiltrados.find(item => item.id_local === id));

        setResultadosPredio(resultadosUnicos.length > 0 ? resultadosUnicos : [{ message: 'Nenhum local encontrado' }]);
      }
    } catch (error) {
      console.error('Erro:', error);
      setResultadosPredio([{ message: 'Erro ao buscar local' }]);
    }
  };


    //--------------------------------------------------EDITAR LOCAL----------------------------------------------------------------

    const abrirEdicaoLocal = (item) => {
      setDadosEditados(item); // Se precisar inicializar, caso contrário, remova esta linha.
    
      MySwal.fire({
        title: 'Editar Localização',
        html: (
          <form id="form-edit">
            <div>
              <strong>ID Local:</strong> {item.id_local}
            </div>
            <input type="text" name="setor" placeholder="Setor" defaultValue={item.setor} />
            <input type="text" name="area" placeholder="Area" defaultValue={item.area} />
            <input type="text" name="gerencia" placeholder="Gerência" defaultValue={item.gerencia} />
            <input type="text" name="predio" placeholder="Predio" defaultValue={item.predio} />
            <input type="text" name="local" placeholder="Local" defaultValue={item.local} />
            <input type="text" name="observacoes" placeholder="Observações da Localização" defaultValue={item.observacoes} />
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
          updatedData.id_local = item.id_local; // Mantendo o id_local
          return updatedData; // Retorna os dados atualizados
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedData = result.value;
          atualizarLocalizacao(updatedData); // Chama sua função de envio
        }
      });
    };
    
  // Função para enviar os dados atualizados
const atualizarLocalizacao = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3002/editlocal`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedData }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Detalhes do erro:', errorDetails);
      throw new Error('Erro ao atualizar item');
    }

    const result = await response.json();
    console.log('Dados atualizados:', result.message);

    setResultadosPredio(prevResultados =>
      prevResultados.map(item =>
        item.predio === updatedData.predio ? { ...item, ...updatedData } : item
      )
    );
    MySwal.fire('Sucesso!', 'Dados atualizados com sucesso.', 'success');
  } catch (error) {
    console.error('Erro ao enviar dados atualizados:', error);
    MySwal.fire('Erro!', 'Não foi possível atualizar os dados.', 'error');
  }
};

    
//--------------------------------------------------EDITAR----------------------------------------------------------------

// Função para enviar os dados atualizados
const handleEditSubmit = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3002/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedData }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Detalhes do erro:', errorDetails);
      throw new Error('Erro ao atualizar item');
    }

    const result = await response.json();
    console.log('Dados atualizados:', result.message);

    setResultados(prevResultados =>
      prevResultados.map(item =>
        item.patrimonio === updatedData.patrimonio ? { ...item, ...updatedData } : item
      )
    );
    MySwal.fire('Sucesso!', 'Dados atualizados com sucesso.', 'success');
  } catch (error) {
    console.error('Erro ao enviar dados atualizados:', error);
    MySwal.fire('Erro!', 'Não foi possível atualizar os dados.', 'error');
  }
};

// Função para abrir o modal de Edição
const abrirModalEdicao = (item) => {
  setModalData(item);

  MySwal.fire({
    title: 'Editar Extintor',
    html: (
      <form id="form-edit">
        <input type="text" name="num_equip" placeholder="Número do Equipamento" defaultValue={item.num_equip} />
        <input type="text" name="tipo" placeholder="Tipo" defaultValue={item.tipo} />
        <input type="text" name="capacidade" placeholder="Capacidade" defaultValue={item.capacidade} />
        <input type="text" name="fabricante" placeholder="Código do Fabricante" defaultValue={item.fabricante} />
        <input type="number" name="data_fabricacao" placeholder="Data de Fabricação" defaultValue={item.data_fabricacao} />
        <input type="text" name="data_validade" placeholder="Data de Validade" defaultValue={item.data_validade} />
        <input type="number" name="ultima_recarga" placeholder="Última Recarga" defaultValue={item.ultima_recarga} />
        <input type="date" name="data_insp" placeholder="Próxima Inspeção" defaultValue={item.data_insp} />
        <input type="text" name="status" placeholder="Status" defaultValue={item.status} />
        <input type="number" name="id_local" placeholder="ID de Localização" defaultValue={item.id_local} />
        <input type="text" name="observacao" placeholder="Observações do Extintor" defaultValue={item.observacao} />
        <input type="text" name="setor" placeholder="Setor" defaultValue={item.setor} />
        <input type="text" name="area" placeholder="Area" defaultValue={item.area} />
        <input type="text" name="gerencia" placeholder="Gerência" defaultValue={item.gerencia} />
        <input type="text" name="predio" placeholder="Predio" defaultValue={item.predio} />
        <input type="text" name="local" placeholder="Local" defaultValue={item.local} />
        <input type="text" name="observacoes" placeholder="Observações da Localização" defaultValue={item.observacoes} />
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
      updatedData.patrimonio = item.patrimonio; // Adiciona o patrimônio
      return { updatedData };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedData = result.value.updatedData;
      handleEditSubmit(updatedData);
    }
  });
};

//--------------------------------------------------DELETAR----------------------------------------------------------------

const handleDelete = async (patrimonio) => {
  console.log('Iniciando a exclusão do patrimônio:', patrimonio);

  // Confirmar a ação de exclusão com o usuário usando SweetAlert2
  const { isConfirmed } = await Swal.fire({
    title: 'Você tem certeza?',
    text: 'Deseja excluir este extintor?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Não',
  });

  if (!isConfirmed) return; // Se não for confirmado, sair da função

  try {
    // Enviar requisição DELETE para o servidor
    const response = await fetch('http://localhost:3002/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patrimonio }), // Passar o patrimônio do extintor a ser excluído
    });

    console.log('Status da resposta:', response.status);

    if (!response.ok) {
      const errorDetails = await response.json(); // Captura os detalhes do erro
      console.error('Detalhes do erro:', errorDetails);
      throw new Error('Erro na exclusão');
    }

    const result = await response.json(); // Captura a resposta JSON
    console.log('Resultado da exclusão:', result); // Log do resultado da exclusão

    // Mostrar a mensagem de sucesso
    await MySwal.fire('Sucesso!', result.message, 'success');

  } catch (error) {
    console.error('Erro ao deletar extintor:', error);
    await MySwal.fire('Erro!', 'Não foi possível deletar o extintor.', 'error');
  }
};


//--------------------------------------------------CADASTRAR----------------------------------------------------------------

const handleCadastroSubmit = async (updatedData) => {
 
  try {
    const response = await fetch(`http://localhost:3002/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ajuste aqui para enviar newData
      body: JSON.stringify({ newData: updatedData }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Detalhes do erro:', errorDetails);
      throw new Error('Erro ao cadastrar item');
    }

    const result = await response.json();
    console.log('Dados cadastrados:', result.message);
    MySwal.fire('Sucesso!', 'Extintor cadastrado com sucesso.', 'success');
  } catch (error) {
    console.error('Erro ao cadastrar extintor:', error);
    MySwal.fire('Erro!', 'Não foi possível cadastrar o extintor.', 'error');
  }
};

// Função para abrir o modal do Cadastro
const abrirModalCadastro = () => {
  MySwal.fire({
    title: 'Cadastrar Extintor',
    html: (
      <form id="form-insert">
        <input type="text" name="patrimonio" placeholder="Patrimônio" />
        <input type="text" name="num_equip" placeholder="Número do Equipamento" />
        <input type="text" name="tipo" placeholder="Tipo" />
        <input type="text" name="capacidade" placeholder="Capacidade" />
        <input type="text" name="fabricante" placeholder="Código do Fabricante" />
        <input type="number" name="data_fabricacao" placeholder="Data de Fabricação" />
        <input type="text" name="data_validade" placeholder="Data de Validade" />
        <input type="number" name="ultima_recarga" placeholder="Última Recarga" />
        <input type="date" name="data_insp" placeholder="Próxima Inspeção" />
        <input type="text" name="status" placeholder="Status" />
        <input type="number" name="id_local" placeholder="ID de Localização" />
        <input type="text" name="observacao" placeholder="Observações do Extintor" />
        <input type="text" name="setor" placeholder="Setor" />
        <input type="text" name="area" placeholder="Area" />
        <input type="text" name="gerencia" placeholder="Gerência"/>
        <input type="text" name="predio" placeholder="Predio" />
        <input type="text" name="local" placeholder="Local" />
        <input type="text" name="observacoes" placeholder="Observações da Localização" />
      </form>
    ),
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const form = document.getElementById('form-insert');
      const formData = new FormData(form);
      const updatedData = {};
      formData.forEach((value, key) => {
        updatedData[key] = value;
      });
      return { newData: updatedData }; // Retorne newData corretamente
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedData = result.value.newData; // Ajuste aqui
      handleCadastroSubmit(updatedData);
    }
  });
};
    
return (
  <div className="layout">
    <Header></Header>
    <Navbar></Navbar>
    <div className='modal-wrapper' style={{paddingTop: '150px'}}> 
      <div className="title-modal">
        <h3>Equipamentos</h3>
      </div>
    </div>
    <div className='container'>
      <h1>Buscar extintor por patrimônio</h1>
          
      {/* Formulário para buscar extintores */}
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
      
      {/* Resultados da busca por patrimônio */}
      <div id="resultados">
        {resultados.map((item, index) => (
          <div key={index} className="resultado-item">
            {item.message ? (
              <p>{item.message}</p>
            ) : (
              <>
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
                <div><strong>Observações do Extintor:</strong> {item.observacao || 'Indisponível'}</div>
                <div><strong>Setor:</strong> {item.setor || 'Indisponível'}</div>
                <div><strong>Área:</strong> {item.area || 'Indisponível'}</div>
                <div><strong>Gerência:</strong> {item.gerencia || 'Indisponível'}</div>
                <div><strong>Prédio:</strong> {item.predio || 'Indisponível'}</div>
                <div><strong>Local:</strong> {item.local || 'Indisponível'}</div>
                <div><strong>Observações da Localização:</strong> {item.observacoes || 'Indisponível'}</div>
              </>
            )}
            {!item.message && (
              <>
                {(role === 'A' || role === 'O') && (
                  <button onClick={() => abrirModalEdicao(item)}>Editar</button>
                )}
                {role === 'A' && (
                  <button onClick={() => handleDelete(item.patrimonio)}>Excluir</button>
                )}
                {item.num_equip && <QRCodeCanvas value={item.num_equip} />}
              </>
            )}
          </div>
        ))}
      </div>
      
      {(role === 'A' || role === 'O') && (
        <button onClick={abrirModalCadastro}>Cadastrar Novo Extintor</button>
      )}
      <div>
        <h1>Buscar localização por prédio</h1>
          <form id="formBuscaLocal" onSubmit={handleBuscaLocalizacao}>
            <input
              type="text"
              id="predio"
              placeholder="Digite o prédio"
              value={predio}
              onChange={(e) => setPredio(e.target.value)}
              required
            />
            <button type="submit">Buscar</button>
          </form>
              {/* Resultados da busca por patrimônio */}
              <div id="resultadosPredio">
                {resultadosPredio.length > 0 ? (
                  resultadosPredio[0].message ? (
                    <p>{resultadosPredio[0].message}</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Id_Local</th>
                          <th>Setor</th>
                          <th>Área</th>
                          <th>Gerência</th>
                          <th>Prédio</th>
                          <th>Local</th>
                          <th>Observações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultadosPredio.map((item, index) => (
                          <tr key={index} onClick={() => abrirEdicaoLocal(item)}>
                            <td>{item.id_local || 'Indisponível'}</td>
                            <td>{item.setor || 'Indisponível'}</td>
                            <td>{item.area || 'Indisponível'}</td>
                            <td>{item.gerencia || 'Indisponível'}</td>
                            <td>{item.predio || 'Indisponível'}</td>
                            <td>{item.local || 'Indisponível'}</td>
                            <td>{item.observacoes || 'Indisponível'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                ) : null}
              </div>
        </div>

        {/* Resultados da busca por localizações */}
  
        <button onClick={handleNavigate}>Relatórios</button> {/* Botão de redirecionamento */}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Busca;