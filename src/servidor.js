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



// Rota 1: Equipamentos por area
app.get('/equipamentos-por-regiao', async (req, res) => {
  try {
    const query = `SELECT area, COUNT(*) AS total FROM metro.localizacoes GROUP BY area ORDER BY area ASC;`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar dados');
  }
});

// Rota 1: validade dos equipamentos por ano
app.get('/validade-equipamentos', async (req, res) => {
  try {
    const query = `SELECT COALESCE(prox_ret::text, 'Validade Desconhecida') as validade, COUNT(*) as total FROM metro.extintores GROUP BY validade ORDER BY validade ASC;`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar dados');
  }
});

app.get('/busca', async (req, res) => {
  const { patrimonio } = req.query; // Recebe a chave de busca por query string
  try {
    const result = await pool.query(
      `SELECT * 
      FROM metro.extintores e
      LEFT JOIN metro.localizacoes l ON e.id_local = l.id_local
      WHERE e.patrimonio LIKE $1`, 
      [`${patrimonio}%`]
    );

    console.log(result.rows); // Verifique os dados que estão sendo retornados
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

app.get('/predio', async (req, res) => {
  const { predio } = req.query; // Recebe a chave de busca por query string
  try {
    const result = await pool.query(
      `SELECT * FROM metro.localizacoes WHERE predio LIKE $1`, 
      [`${predio}%`]
    );

    console.log(result.rows); // Verifique os dados que estão sendo retornados
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

app.put('/editlocal', async (req, res) => {
  const { updatedData } = req.body;
  const { predio } = updatedData;

  if (!predio) {
    return res.status(400).json({ message: 'Local não fornecido.' });
  }

  const client = await pool.connect(); // Conecte-se ao banco de dados

  try {
    await client.query('BEGIN'); // Inicie a transação

    // Atualização da tabela metro.localizacoes usando o mesmo id_local
    const updateQuery = `
      UPDATE metro.localizacoes SET 
      setor = $1, 
      area = $2, 
      gerencia = $3, 
      predio = $4, 
      local = $5, 
      observacoes = $6 
      WHERE id_local = $7
    `;

    const values = [
      updatedData.setor || null,
      updatedData.area || null,
      updatedData.gerencia || null,
      updatedData.predio || null,
      updatedData.local || null,
      updatedData.observacoes || null,
      updatedData.id_local 
    ];

    await client.query(updateQuery, values); // Corrigido aqui

    await client.query('COMMIT'); // Confirme a transação

    res.json({ message: 'Item atualizado com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK'); // Desfaça a transação em caso de erro
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ message: 'Erro ao atualizar item' });
  } finally {
    client.release(); // Libere o cliente de volta ao pool
  }
});


app.put('/update', async (req, res) => {
  const { updatedData } = req.body;
  const { patrimonio } = updatedData;

  if (!patrimonio) {
    return res.status(400).json({ message: 'Patrimônio não fornecido.' });
  }

  const client = await pool.connect(); // Conecte-se ao banco de dados

  try {
    await client.query('BEGIN'); // Inicie a transação

    // Atualização da tabela metro.extintores
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
      updatedData.num_equip || null,  
      updatedData.tipo || null,
      updatedData.capacidade || null,
      updatedData.fabricante || null,
      updatedData.prox_ret || null,
      updatedData.data_insp || null,
      updatedData.prox_rec || null,
      updatedData.nao_conf || null,
      updatedData.id_local || null,
      updatedData.observacao || null,
      patrimonio
    ];

    const result = await client.query(updateQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Atualização da tabela metro.localizacoes usando o mesmo id_local
    const updateQuery_2 = `
      UPDATE metro.localizacoes SET 
      setor = $1, 
      area = $2, 
      gerencia = $3, 
      predio = $4, 
      local = $5, 
      observacoes = $6 
      WHERE id_local = $7
    `;

    const values_2 = [
      updatedData.setor || null,
      updatedData.area || null,
      updatedData.gerencia || null,
      updatedData.predio || null,
      updatedData.local || null,
      updatedData.observacoes || null,
      updatedData.id_local // Aqui usamos o mesmo id_local da tabela extintores
    ];

    await client.query(updateQuery_2, values_2);

    await client.query('COMMIT'); // Confirme a transação

    res.json({ message: 'Item atualizado com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK'); // Desfaça a transação em caso de erro
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ message: 'Erro ao atualizar item' });
  } finally {
    client.release(); // Libere o cliente de volta ao pool
  }
});

// Endpoint para inserir um novo extintor 
app.post('/insert', async (req, res) => {
  const { newData } = req.body;

  // Verifique se o novo dado e o patrimônio estão presentes
  if (!newData || !newData.patrimonio) {
    return res.status(400).json({ message: 'Erro: O campo patrimonio é obrigatório.' });
  }

  const client = await pool.connect(); // Conecte-se ao banco de dados

  try {
    await client.query('BEGIN'); // Inicie a transação

    // Verifique se o patrimonio já existe na tabela metro.extintores
    const checkPatrimonioQuery = `SELECT 1 FROM metro.extintores WHERE patrimonio = $1`;
    const checkPatrimonioResult = await client.query(checkPatrimonioQuery, [newData.patrimonio]);

    if (checkPatrimonioResult.rows.length > 0) {
      return res.status(400).json({ message: 'Erro: O patrimônio informado já existe.' });
    }

    // Verifique se pelo menos um campo de localização foi fornecido
    const { setor, area, gerencia, predio, local, observacoes } = newData;
    const isLocationProvided = setor || area || gerencia || predio || local || observacoes;

    let idLocal; // Declare a variável idLocal

    // Inserção na tabela metro.localizacoes se houver dados de localização
    if (isLocationProvided) {
      const insertLocationQuery = `
        INSERT INTO metro.localizacoes (setor, area, gerencia, predio, local, observacoes) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_local
      `;

      const locationValues = [
        setor || null,
        area || null,
        gerencia || null,
        predio || null,
        local || null,
        observacoes || null,
      ];

      const locationResult = await client.query(insertLocationQuery, locationValues);
      idLocal = locationResult.rows[0].id_local; // Obtenha o id_local gerado
    }

    // Inserção na tabela metro.extintores
    const insertExtintorQuery = `
      INSERT INTO metro.extintores (num_equip, tipo, capacidade, fabricante, prox_ret, data_insp, prox_rec, nao_conf, observacao, patrimonio${idLocal ? ', id_local' : ''}) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10${idLocal ? ', $11' : ''})
    `;
    
    const extintorValues = [
      newData.num_equip || null,
      newData.tipo || null,
      newData.capacidade || null,
      newData.fabricante || null,
      newData.prox_ret || null,
      newData.data_insp || null,
      newData.prox_rec || null,
      newData.nao_conf || null,
      newData.observacao || null,
      newData.patrimonio, // Aqui garantimos que o patrimônio é fornecido
      ...(idLocal ? [idLocal] : []), // Adiciona o id_local à inserção do extintor, se existir
    ];

    await client.query(insertExtintorQuery, extintorValues);

    await client.query('COMMIT'); // Confirme a transação

    res.json({ message: 'Novo extintor adicionado com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK'); // Desfaça a transação em caso de erro
    console.error('Erro ao adicionar novo extintor:', error);
    res.status(500).json({ message: `Erro ao adicionar novo extintor: ${error.message}` });
  } finally {
    client.release(); // Libere o cliente de volta ao pool
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
    // Retorna uma mensagem de sucesso
    return res.status(200).json({ message: 'Extintor deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir extintor:', error);
    res.status(500).json({ message: 'Erro ao excluir extintor' });
  }
});

// Inicia o servidor
app.listen(3002, () => {
  console.log('Servidor rodando na porta 3002');
});
