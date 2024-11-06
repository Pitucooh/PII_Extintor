// Importa as dependências necessárias
const request = require('supertest');
const express = require('express');
const app = require('./src/servidor.js');
const pool = require('pg');  // Importando o Pool do pg

describe('Testes do Servidor', () => {
   
  // Teste de rota GET para /manutencao/:id
  describe('GET /manutencao/:id', () => {
    it('deve retornar status 200 e dados da manutenção para ID válido', async () => {
      const response = await request(app).get('/manutencao/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id_manutencao', 1); 
      expect(response.body).toHaveProperty('desc'); 
      expect(response.body).toHaveProperty('observacoes'); 
      expect(response.body).toHaveProperty('patrimonio'); 
      expect(response.body).toHaveProperty('resp'); 
    });
  
    it('deve retornar status 404 para ID inválido', async () => {
      const response = await request(app).get('/manutencao/999'); // ID que não existe
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Manutenção não encontrada');
    });
  });
  
  // Teste de rota GET para /historico/:id
  describe('GET /historico/:id', () => {
    it('deve retornar status 200 e histórico para ID válido', async () => {
      const response = await request(app).get('/historico/0028');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('manutencoes'); 
      expect(response.body.manutencoes).toBeInstanceOf(Array); 
      expect(response.body).toHaveProperty('patrimonio');
      expect(response.body).toHaveProperty('totalManutencoes'); 
    });
  
    it('deve retornar status 404 para ID inválido', async () => {
      const response = await request(app).get('/historico/9999'); // ID que não existe
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Nenhuma manutenção encontrada para este patrimônio');
    });
  });
  

  // Teste de rota POST para login
  describe('POST /login', () => {
    it('deve retornar status 200 e um token para credenciais válidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          n_registro: '12345',    // Número de registro válido
          cpf: '111.222.333-44',  // CPF válido
          role: 'admin'           // Papel (role) válido para login de administrador
        });
  
      expect(response.status).toBe(200);  // Espera o status 200
      expect(response.body).toHaveProperty('message', 'Login bem-sucedido como administrador'); // Verifica a mensagem
      // Se houver um token, pode ser validado aqui também, como por exemplo:
      expect(response.body).toHaveProperty('user');  // Confirma que o usuário foi retornado
    });
  
    it('deve retornar status 401 para credenciais inválidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          n_registro: '12345',
          cpf: '111.222.333-77', 
          status: 'A'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciais inválidas');
    });
  });

  //teste busca por patrimonio
  describe('GET /busca', () => {
  
    // Teste quando o patrimônio existe no banco de dados
    it('deve retornar status 200 e os dados corretos quando o patrimônio for fornecido', async () => {
      const patrimonio = '0028'; // Exemplo de patrimônio que você quer buscar
    
      const response = await request(app)
        .get('/busca')
        .query({ patrimonio });
  
      expect(response.status).toBe(200);  // Espera o status 200  
      expect(response.body).toBeInstanceOf(Array);  // Verifica se a resposta é um array  
      expect(response.body.length).toBeGreaterThan(0); // Espera que o array tenha pelo menos um item  
  
      // Verifica se o patrimônio está presente nos dados retornados
      response.body.forEach(item => {
        expect(item.patrimonio).toBeTruthy();  // Verifica se o patrimônio está presente em cada item
        expect(item.patrimonio).toMatch(new RegExp(`^${patrimonio}`)); // Verifica se o patrimônio começa com o valor fornecido
      });
    });

    // Teste quando o patrimônio não existe no banco de dados
    it('deve retornar status 200 e um array vazio quando o patrimônio não existir', async () => {
      const patrimonioInexistente = '9999'; // Exemplo de patrimônio que não existe
  
      const response = await request(app)
        .get('/busca')
        .query({ patrimonio: patrimonioInexistente });
  
      expect(response.status).toBe(200);  // Espera o status 200
      expect(response.body).toBeInstanceOf(Array);  // Verifica que a resposta é um array
      expect(response.body.length).toBe(0);  // Verifica que o array está vazio (nenhum dado encontrado)
    });
  });
  
  //Teste api relatorios 
  describe('GET /api/relatorios', () => {
    it('deve retornar status 200 e dados para o tipo de relatório validadeNoAno', async () => {
      const response = await request(app)
        .get('/api/relatorios')
        .query({ type: 'validadeNoAno' });
  
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      // Verifique se os dados retornados têm os campos esperados (ajuste conforme a estrutura real dos dados)
      response.body.forEach(item => {
        expect(item).toHaveProperty('prox_ret');
      });
    });
  
    it('deve retornar status 200 e dados para o tipo de relatório naoConformidades', async () => {
      const response = await request(app)
        .get('/api/relatorios')
        .query({ type: 'naoConformidades' });
  
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach(item => {
        expect(item).toHaveProperty('nao_conf');
      });
    });
  
    it('deve retornar status 400 para tipo de relatório inválido', async () => {
      const response = await request(app)
        .get('/api/relatorios')
        .query({ type: 'tipoInvalido' });
  
      expect(response.status).toBe(400);
      expect(response.text).toBe('Tipo de relatório inválido.');
    });
  });
  
  //Teste api graficos 
  describe('GET /api/graficos', () => {
    it('deve retornar status 200 e dados para o gráfico validadePorAno', async () => {
      const response = await request(app)
        .get('/api/graficos')
        .query({ type: 'validadePorAno' });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('values');
    });
  
    it('deve retornar status 200 e dados para o gráfico totalPorTipo', async () => {
      const response = await request(app)
        .get('/api/graficos')
        .query({ type: 'totalPorTipo' });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('values');
    });
  
    it('deve retornar status 400 para tipo de gráfico inválido', async () => {
      const response = await request(app)
        .get('/api/graficos')
        .query({ type: 'graficoInvalido' });
  
      expect(response.status).toBe(400);
      expect(response.text).toBe('Tipo de gráfico inválido.');
    });
  });
  
  //teste equipamentos por regiao
  describe('GET /equipamentos-por-regiao', () => {
    it('deve retornar status 200 e os equipamentos por região', async () => {
      const response = await request(app).get('/equipamentos-por-regiao');
  
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach(item => {
        expect(item).toHaveProperty('predio');
        expect(item).toHaveProperty('total');
      });
    });
  });
  
  describe('GET /validade-equipamentos', () => {
    it('deve retornar status 200 e a validade dos equipamentos por ano', async () => {
      const response = await request(app).get('/validade-equipamentos');
  
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach(item => {
        expect(item).toHaveProperty('validade');
        expect(item).toHaveProperty('total');
      });
    });
  });

  //teste busca por predio
  describe('GET /predio', () => {
    it('should return a list of localizacoes with predio matching the query', async () => {
      const response = await request(app)
        .get('/predio')
        .query({ predio: 'BRIGADEIRO' }); // Altere para o valor que você quer testar
  
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array); // Esperamos que o corpo da resposta seja um array
      expect(response.body.length).toBeGreaterThan(0); // Esperamos que haja pelo menos um item na resposta
      expect(response.body[0]).toHaveProperty('predio'); // Verifique se o primeiro item tem a propriedade 'predio'
    });
  
    it('should return 500 if there is a server error', async () => {
      // Simular erro de servidor
      jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));
  
      const response = await request(app).get('/predio').query({ predio: 'Edificio X' });
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro no servidor');
    });
  });
  

describe('PUT /editlocal', () => {
  it('should update the localizacao and return success message', async () => {
    const updatedData = {
      id_local: 1,
      predio: 'Novo Edificio',
      setor: 'Novo Setor',
      area: 'Area 100',
      gerencia: 'Gerencia A',
      local: 'Local A',
      observacoes: 'Observacao A'
    };

    const response = await request(app)
      .put('/editlocal')
      .send({ updatedData });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item atualizado com sucesso');
  });

  it('should return 400 if predio is not provided', async () => {
    const updatedData = { id_local: 1 };

    const response = await request(app)
      .put('/editlocal')
      .send({ updatedData });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Local não fornecido.');
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

    const updatedData = {
      patrimonio: 1
    };

    const response = await request(app)
      .put('/editlocal')
      .send({ updatedData });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erro ao atualizar item');
  });
});

describe('PUT /update', () => {
  it('should update the extintor and location and return success message', async () => {
    const updatedData = {
      patrimonio: '1234',
      num_equip: '5678',
      tipo: 'CO2',
      capacidade: '5L',
      fabricante: 'Fabricante A',
      prox_ret: '2025-12-31',
      data_insp: '2024-01-01',
      prox_rec: '2024-06-01',
      nao_conf: 'Sim',
      id_local: 1,
      setor: 'Setor X',
      area: 'Area 200',
      gerencia: 'Gerencia B',
      predio: 'Edificio Y',
      local: 'Local B',
      observacoes: 'Observacao B'
    };

    const response = await request(app)
      .put('/update')
      .send({ updatedData });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item atualizado com sucesso');
  });

  it('should return 400 if patrimonio is not provided', async () => {
    const updatedData = { num_equip: '1234' };

    const response = await request(app)
      .put('/update')
      .send({ updatedData });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Patrimônio não fornecido.');
  });

  it('should return 500 if there is a server error', async () => {
    jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

    const updatedData = {
      patrimonio: '1234',
      num_equip: '5678',
    };

    const response = await request(app)
      .put('/update')
      .send({ updatedData });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erro ao atualizar item');
  });
});

describe('POST /insert', () => {
  it('should insert a new extintor and location successfully', async () => {
    const newData = {
      patrimonio: '12345',
      num_equip: '23456',
      tipo: 'ABC',
      capacidade: '10L',
      fabricante: 'Fabricante B',
      prox_ret: '2026-06-30',
      data_insp: '2025-01-01',
      prox_rec: '2025-07-01',
      nao_conf: 'Não',
      id_local: 2,
      setor: 'Setor Y',
      area: 'Area 300',
      gerencia: 'Gerencia C',
      predio: 'Edificio Z',
      local: 'Local C',
      observacoes: 'Observacao C'
    };

    const response = await request(app)
      .post('/insert')
      .send({ newData });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Novo extintor adicionado com sucesso');
  });

  it('should return 400 if patrimonio is missing', async () => {
    const newData = { tipo: 'CO2' };

    const response = await request(app)
      .post('/insert')
      .send({ newData });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Erro: O campo patrimonio é obrigatório.');
  });
});


describe('DELETE /delete', () => {
  it('should delete an extintor successfully', async () => {
    const response = await request(app)
      .delete('/delete')
      .send({ patrimonio: '0028' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Extintor deletado com sucesso');
  });

  it('should return 404 if extintor not found', async () => {
    const response = await request(app)
      .delete('/delete')
      .send({ patrimonio: '9999' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Extintor não encontrado');
  });
});
});
