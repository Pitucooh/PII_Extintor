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

// Endpoint para buscar extintores
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

// Página de teste para ver se está funcionando
app.get('/test', (req, res) => {
  res.send('Servidor funcionando!');
});

// Endpoint para atualizar um item
app.put('/update/:id', async (req, res) => {
  const id = req.params.id; // ID do item a ser atualizado
  const updatedData = req.body; // Dados enviados no corpo da requisição

  try {
    // Verificar se o patrimônio já existe
    const checkQuery = 'SELECT * FROM metro.extintores WHERE patrimonio = $1 AND id != $2';
    const checkValues = [updatedData.patrimonio, id];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rowCount > 0) {
      return res.status(400).json({ message: 'Patrimônio já existe, escolha um valor diferente.' });
    }

    // Atualizando o item no banco de dados
    const updateQuery = `
      UPDATE metro.extintores SET 
      patrimonio = $1, 
      num_equip = $2, 
      tipo = $3, 
      capacidade = $4, 
      fabricante = $5, 
      prox_ret = $6, 
      data_insp = $7, 
      prox_rec = $8, 
      nao_conf = $9, 
      id_local = $10, 
      observacao = $11
    `;

    const values = [
      updatedData.patrimonio,
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

// Endpoint para inserir um novo item
app.post('/insert', async (req, res) => {
  const newItem = req.body; // Dados enviados no corpo da requisição

  try {
    // Verificar se o patrimônio já existe
    const checkQuery = 'SELECT * FROM metro.extintores WHERE patrimonio = $1';
    const checkValues = [newItem.patrimonio];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rowCount > 0) {
      return res.status(400).json({ message: 'Patrimônio já existe, escolha um valor diferente.' });
    }

    // Inserindo o novo item no banco de dados
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
      newItem.id_local,
      newItem.observacao,
    ];

    await pool.query(insertQuery, values);

    res.status(201).json({ message: 'Item inserido com sucesso' });
  } catch (error) {
    console.error('Erro ao inserir item:', error);
    res.status(500).json({ message: 'Erro ao inserir item' });
  }
});

// Inicia o servidor
app.listen(3002, () => {
  console.log('Servidor rodando na porta 3002');
});
