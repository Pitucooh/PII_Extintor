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
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [patrimonio, setPatrimonio] = useState('');
  const [historico, setHistorico] = useState([]);
  const [error, setError] = useState('');
  const [resultados, setResultados] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [dadosEditados, setDadosEditados] = useState(null);
  const [predio, setPredio] = useState(''); 
  const [resultadosPredio, setResultadosPredio] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [patrimonioManut, setPatrimonioManut] = useState('');
  const [errormanut, setErrormanut] = useState('');

  const navigate = useNavigate(); // Inicializa o hook
  const handleNavigate = () => {
    navigate('/Relatorio'); // Redireciona para outra página
  };

  const abrirModalExtintor = (dados) => {
    setItemSelecionado(dados);
    setModalAberto('modalExtintor');
  };

  const abrirModalPredio = (dados) => {
    setItemSelecionado(dados);
    setModalAberto('modalPredio');
  };

  const fecharModal = () => {
    setModalAberto(null);
    setItemSelecionado(null);
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
    const predioLimpo = predio.trim().toUpperCase();

    try {
      const response = await fetch(`http://localhost:3002/predio?predio=${encodeURIComponent(predioLimpo)}`);
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const dados = await response.json();
      setResultadosPredio(dados);
    } catch (error) {
      console.error('Erro:', error);
      setResultadosPredio([{ message: 'Erro ao buscar local' }]);
    }
  };

  //--------------------------------------------------BUSCA ID MANUTENÇÃO----------------------------------------------------------------
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

  //--------------------------------------------------BUSCA MANUTENÇÕES POR PATRIMONIO----------------------------------------------------------------
  const handle_Ext_Manut = async (e) => {
    e.preventDefault();
    setErrormanut('');
  
    try {
      const response = await fetch(`http://localhost:3002/historico/${patrimonioManut}`);
      if (!response.ok) throw new Error('Registro não encontrado');
      const results = await response.json();
      console.log(results);
      setHistorico(results);
    } catch (err) {
      setErrormanut(err.message);
      setHistorico([]);
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
        <input type="number" name="prox_rec" placeholder="Próxima Recarga" defaultValue={item.prox_rec} />
        <input type="date" name="data_insp" placeholder="Próxima Inspeção" defaultValue={item.data_insp} />
        <input type="text" name="status" placeholder="Status"   defaultValue={item.nao_conf || 'Funcionando'} />
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
    customClass: {
      popup: 'custom-modal', // Adiciona uma classe personalizada ao modal
    },
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
        <input type="text" name="nao_conf" placeholder="Status" />
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
  <div className='cadastrar-container'>
  {(role === 'A' || role === 'O') && (
    <button className='button-cadastrar' onClick={abrirModalCadastro}>
      <span className="icon">+</span>
      <span className="button-text">Cadastrar Novo Extintor</span>
    </button>
  )}
  </div>
  <div className='container-wrapper'>
    {/* Container para busca por patrimônio */}
    <div className='search-container'>
      <h1 className='containerPatr'>Buscar extintor por patrimônio</h1>
      <form id="formBusca" onSubmit={handleSubmit}>
        <input
          type="text"
          id="patrimonio"
          placeholder="Digite o patrimônio"
          value={patrimonio}
          onChange={(e) => setPatrimonio(e.target.value)}
          required
        />
        <button className='button-busca' type="submit">Buscar</button>
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
                <button onClick={() => abrirModalExtintor(item)}>Ver Detalhes</button>
              </>
            )}
          </div>
        ))}
      </div>

      {modalAberto === 'modalExtintor' && itemSelecionado ? (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-conteudo">
              <button className='modal-close' style={{backgroundColor: 'rgb(209, 8, 8)'}} onClick={fecharModal}>Fechar</button>
              <>
                {(role === 'A' || role === 'O') && (
                  <button onClick={() => abrirModalEdicao(itemSelecionado)}>Editar</button>
                )}
                <div style={{padding: '10px'}}></div>
                <h2>Detalhes do Equipamento</h2>
                <p><strong>Número do Equipamento:</strong> {itemSelecionado.num_equip || 'Indisponível'}</p>
                <p><strong>Tipo:</strong> {itemSelecionado.tipo || 'Indisponível'}</p>
                <p><strong>Capacidade:</strong> {itemSelecionado.capacidade || 'Indisponível'}</p>
                <p><strong>Código do Fabricante:</strong> {itemSelecionado.fabricante || 'Indisponível'}</p>
                <p><strong>Data de Fabricação:</strong> {itemSelecionado.data_fabricacao || 'Indisponível'}</p>
                <p><strong>Data de Validade:</strong> {itemSelecionado.prox_ret || 'Indisponível'}</p>
                <p><strong>Última Recarga:</strong> {itemSelecionado.ultima_recarga || 'Indisponível'}</p>
                <p><strong>Próxima Inspeção:</strong> {itemSelecionado.data_insp || 'Indisponível'}</p>
                <p><strong>Próxima Recarga:</strong> {itemSelecionado.prox_rec || 'Indisponível'}</p>
                <p><strong>Status:</strong> {itemSelecionado.nao_conf || 'Funcionando'}</p>
                <p><strong>ID de Localização:</strong> {itemSelecionado.id_local || 'Indisponível'}</p>
                <p><strong>Observações do Extintor:</strong> {itemSelecionado.observacao || 'Indisponível'}</p>
                <p><strong>Setor:</strong> {itemSelecionado.setor || 'Indisponível'}</p>
                <p><strong>Área:</strong> {itemSelecionado.area || 'Indisponível'}</p>
                <p><strong>Gerência:</strong> {itemSelecionado.gerencia || 'Indisponível'}</p>
                <p><strong>Prédio:</strong> {itemSelecionado.predio || 'Indisponível'}</p>
                <p><strong>Local:</strong> {itemSelecionado.local || 'Indisponível'}</p>
                <p><strong>Observações da Localização:</strong> {itemSelecionado.observacoes || 'Indisponível'}</p>
                {itemSelecionado.num_equip && <QRCodeCanvas value={itemSelecionado.patrimonio} />}

                {role === 'A' && (
                  <button style={{backgroundColor: 'rgb(209, 8, 8)'}} onClick={() => handleDelete(itemSelecionado.patrimonio)}>Excluir</button>
                )}
              </>
            </div>
          </div>
        </div>
      ) : (
        modalAberto && <p>Erro: Item selecionado não encontrado.</p> // Mensagem de erro para depuração
      )}
    </div>

    {/* Container para busca por localização */}
    <div className='containerLocal'>
      <h1 className='containerLoc'>Buscar localização por prédio</h1>
      <form id="formBuscaLocal" onSubmit={handleBuscaLocalizacao}>
        <input
          type="text"
          id="predio"
          placeholder="Digite o prédio"
          value={predio}
          onChange={(e) => setPredio(e.target.value)}
          required
        />
        <button className='button-busca' type="submit">Buscar</button>
      </form>

      <div id="resultadosPredio">
        {resultadosPredio.length > 0 ? (
          resultadosPredio[0].message ? (
            <p>{resultadosPredio[0].message}</p>
          ) : (
            <div>
              <button onClick={() => abrirModalPredio(resultadosPredio)}>Ver Detalhes</button>
            </div>
          )
        ) : null}
      </div>

      {/* Modal */}
      {modalAberto === 'modalPredio' && (
      <div className="modal-overlay" onClick={fecharModal}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className='modal-close' style={{backgroundColor: 'rgb(209, 8, 8)'}} onClick={fecharModal}>Fechar</button>
          <h2>Equipamentos localizados no prédio {predio}</h2>
          <table>
            <thead>
              <tr>
                <th>Patrimonio</th>
                <th>Equipamento</th>
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
              {itemSelecionado.map((item, index) => (
                <tr key={index}>
                  <td>{item.patrimonio || 'Indisponível'}</td>
                  <td>{item.num_equip || 'Indisponível'}</td>
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
        </div>
      </div>
    )}
    </div>

    {/* Container para busca por manutenção */}
    <div className='containerManu'>
      <h1>Extintores por Manutenção</h1>
      <form onSubmit={handle_Manut_Ext}>
        <label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            placeholder="Digite o ID da manutenção"
          />
        </label>
        <button className='button-busca' type="submit">Buscar</button>
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
    </div>

    {/* Container para histórico de manutenções */}
    <div className='containerHist'>
      <h1>Manutenções por Extintor</h1>
      <form onSubmit={handle_Ext_Manut}>
        <label>
          <input
            type="text"
            placeholder="Digite o patrimônio do extintor"
            value={patrimonioManut}
            onChange={(e) => setPatrimonioManut(e.target.value)}
            required
          />
        </label>
        <button className='button-busca' type="submit">Buscar Histórico</button>
      </form>
      {errormanut && <p>{errormanut}</p>}
      {historico && historico.manutencoes && historico.manutencoes.length > 0 && (
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
      )}
    </div>
  </div>
    
  <Footer></Footer>
</div>

  );
};

export default Busca;