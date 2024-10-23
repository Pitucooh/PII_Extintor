const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

// Middleware para interpretar o corpo das requisições como JSON
app.use(express.json());

// Conexão com o banco
const pool = new Pool({
  user: 'postgres',
  host: '35.198.43.67',
  database: 'postgres',
  password: '5yQD$ee7jHBsj&Tp',
  port: 5432,
});

// Habilita CORS
app.use(cors());

app.get('/busca', async (req, res) => {
  const { patrimonio } = req.query; // Recebe a chave de busca por query string
  try {
    const result = await pool.query('SELECT * FROM metro.extintores WHERE patrimonio LIKE $1', [`${patrimonio}`]);
    console.log(result.rows); // Verifique os dados que estão sendo retornados
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

app.get('/manutencao/:id', async (req, res) => {
  const { id } = req.params; // Recebe o ID da manutenção da URL
  try {
    const result = await pool.query('SELECT * FROM metro.hist_manutencao WHERE id_manutencao = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Retorna a primeira linha encontrada
    } else {
      res.status(404).json({ message: 'Manutenção não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.get('/historico/:patrimonio', async (req, res) => {
  const { patrimonio } = req.params; // Recebe o patrimonio da URL
  debugger;
  try {
    const result = await pool.query(
      'SELECT * FROM metro.hist_manutencao WHERE patrimonio = $1', 
      [patrimonio]
    );

    if (result.rows.length > 0) {
      res.json(result.rows); // Retorna todas as linhas encontradas
    } else {
      res.status(404).json({ message: 'Nenhuma manutenção encontrada para este patrimônio' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Endpoint para atualizar um extintor 
app.put('/update', async (req, res) => {
  const { updatedData } = req.body; 

  if (!updatedData) {
    return res.status(400).json({ message: 'Dados de atualização não fornecidos.' });
  }

  const { patrimonio } = updatedData;

  try {
    // Atualizando o item no banco de dados
    const updateQuery = `
      UPDATE metro.extintores SET 
      num_equip = $1, 
      tipo = $2, 
      capacidade = $3, 
      fabricante = $4, 
      prox_ret = $5, 
      data_insp = $6, 
      prox_rec = $7, 
      nao_conf = $8, 
      id_local = $9, 
      observacao = $10 
      WHERE patrimonio = $11
    `;

    const values = [
      updatedData.num_equip,
      updatedData.tipo,
      updatedData.capacidade,
      updatedData.fabricante,
      updatedData.prox_ret,
      updatedData.data_insp,
      updatedData.prox_rec,
      updatedData.nao_conf,
      updatedData.id_local,
      updatedData.observacao,
      patrimonio, // Usando o patrimônio como chave para localizar o registro
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.json({ message: 'Item atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ message: 'Erro ao atualizar item' });
  }
});

// Função para gerar um id_local aleatório
const generateUniqueId = async () => {
  const minId = 1; // Defina o valor mínimo para o id_local
  const maxId = 99999; // Defina o valor máximo para o id_local
  let uniqueId;

  do {
    uniqueId = Math.floor(Math.random() * (maxId - minId + 1)) + minId; // Gera um número aleatório
    const checkQuery = 'SELECT * FROM metro.localizacoes WHERE id_local = $1';
    const checkValues = [uniqueId];
    const checkResult = await pool.query(checkQuery, checkValues);
    
  } while (checkResult.rowCount > 0); // Continue gerando até encontrar um único id_local

  return uniqueId;
};

let tempIdLocal; // Variável global para armazenar o id_local temporariamente

// Endpoint para inserir uma nova localização
app.post('/insertlocal', async (req, res) => {
  const newItem = req.body; // Dados enviados no corpo da requisição

  try {
    // Gerar um id_local único
    tempIdLocal = await generateUniqueId(); // Armazena o id_local temporariamente

    // Inserindo o novo item na tabela localizacoes
    const locationQuery = `
      INSERT INTO metro.localizacoes (
        id_local, setor, area, gerencia, predio, local, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const locationValues = [
      tempIdLocal, // Usando o id_local gerado
      newItem.setor,
      newItem.localizacao.area,
      newItem.localizacao.gerencia,
      newItem.localizacao.predio,
      newItem.localizacao.local,
      newItem.localizacao.observacoes
    ];

    console.log('Valores para localizacoes:', locationValues); // Adicionando log para depuração

    await pool.query(locationQuery, locationValues);
    res.status(201).json({ message: 'Localização inserida com sucesso' });
  } catch (error) {
    console.error('Erro ao inserir localização:', error);
    res.status(500).json({ message: 'Erro ao inserir localização' });
  }
});

// Endpoint para inserir um novo extintor
app.post('/insertextintor', async (req, res) => {
  const newItem = req.body; // Dados enviados no corpo da requisição

  try {
    // Verificar se o patrimônio já existe
    const checkQuery = 'SELECT * FROM metro.extintores WHERE patrimonio = $1';
    const checkValues = [newItem.patrimonio];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rowCount > 0) {
      return res.status(400).json({ message: 'Patrimônio já existe, escolha um valor diferente.' });
    }

    const insertQuery = `
      INSERT INTO metro.extintores (
        patrimonio, num_equip, tipo, capacidade, fabricante, prox_ret, 
        data_insp, prox_rec, nao_conf, id_local, observacao
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    const values = [
      newItem.patrimonio,
      newItem.num_equip,
      newItem.tipo,
      newItem.capacidade,
      newItem.fabricante,
      newItem.prox_ret,
      newItem.data_insp,
      newItem.prox_rec,
      newItem.nao_conf,
      tempIdLocal, // Usando o id_local gerado anteriormente
      newItem.observacao,
    ];

    console.log('Valores para extintores:', values); // Adicionando log para depuração

    await pool.query(insertQuery, values);
    res.status(201).json({ message: 'Extintor inserido com sucesso' });
  } catch (error) {
    console.error('Erro ao inserir extintor:', error);
    res.status(500).json({ message: 'Erro ao inserir extintor' });
  }
});

// Endpoint para excluir um item pelo patrimônio
app.delete('/delete', async (req, res) => {
  const { patrimonio } = req.body; // Patrimônio do item a ser excluído

  try {
    const result = await pool.query('DELETE FROM metro.extintores WHERE patrimonio = $1', [patrimonio]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Extintor não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao excluir extintor:', error);
    res.status(500).json({ message: 'Erro ao excluir extintor' });
  }
});

// Inicia o servidor
app.listen(3002, () => {
  console.log('Servidor rodando na porta 3002');
});
