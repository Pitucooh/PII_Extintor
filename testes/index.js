const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

// conexão com o banco
const pool = new Pool({
  user: 'postgres',
  host: '35.198.43.67',
  database: 'postgres',
  password: '5yQD$ee7jHBsj&Tp',
  port: 5432,
});

// habilita CORS
app.use(cors());

// endpoint para buscar extintores
app.get('/busca', async (req, res) => {
  const { patrimonio } = req.query; // recebe a chave de busca por query string
  try {
    const result = await pool.query('SELECT * FROM metro.extintores WHERE patrimonio LIKE $1', [`${patrimonio}`]);
    console.log(result.rows); // verifique os dados que estão sendo retornados
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('erro no servidor');
  }
});

// pagina de test para ver se ta funcinando
app.get('/test', (req, res) => {
  res.send('servidor funcionando!');
});

// inicia o servidor / mudar porta se precisar
app.listen(3002, () => {
  console.log('servidor rodando na porta 3002');
});
