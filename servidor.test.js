// Importa as dependências necessárias
const request = require('supertest');
const express = require('express');
const app = require('./src/servidor.js');

// Configuração de exportação para o app
module.exports = app;

describe('Testes do Servidor', () => {
   
  // Teste de rota GET para /manutencao/:id
  describe('GET /manutencao/:id', () => {
    it('deve retornar status 200 e dados da manutenção para ID válido', async () => {
      const response = await request(app).get('/manutencao/1'); 
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1); // Verifica se o ID retornado está correto
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
      const response = await request(app).get('/historico/1'); 
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('historico');
    });

    it('deve retornar status 404 para ID inválido', async () => {
      const response = await request(app).get('/historico/999'); // ID que não existe
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Histórico não encontrado');
    });
  });

  // Teste de rota POST para login
  describe('POST /login', () => {
    it('deve retornar status 200 e um token para credenciais válidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          n_registro: '12345',
          cpf: '111.222.333-44', 
          status: 'A'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token'); 
    });

    it('deve retornar status 401 para credenciais inválidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          cpf: 'invalid_cpf', // CPF inválido
          n_registro: 'invalid_registro', // Registro inválido
          role: 'admin'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciais inválidas');
    });
  });

});
