const request = require('supertest');
const { expect } = require('chai');
const app = require('./app');

describe('API de Usuários e Transferências', function () {
  let server;
  before(function (done) {
    server = app.listen(4000, done);
  });
  after(function (done) {
    server.close(done);
  });

  describe('Registro de usuários', function () {
    it('deve registrar nathalia com sucesso', async function () {
      const res = await request(server)
        .post('/users/register')
        .send({ username: 'nathalia', password: '123456', favorecidos: ['bruno'] });
      expect(res.status).to.equal(201);
    });
    it('deve registrar bruno com sucesso', async function () {
      const res = await request(server)
        .post('/users/register')
        .send({ username: 'bruno', password: '123456', favorecidos: [] });
      expect(res.status).to.equal(201);
    });
    it('não deve registrar usuário duplicado', async function () {
      const res = await request(server)
        .post('/users/register')
        .send({ username: 'nathalia', password: '123456' });
      expect(res.status).to.equal(409);
    });
  });

  describe('Login de usuários', function () {
    it('deve logar nathalia com sucesso', async function () {
      const res = await request(server)
        .post('/users/login')
        .send({ username: 'nathalia', password: '123456' });
      expect(res.status).to.equal(200);
    });
    it('não deve logar com senha errada', async function () {
      const res = await request(server)
        .post('/users/login')
        .send({ username: 'nathalia', password: 'errada' });
      expect(res.status).to.equal(401);
    });
  });

  describe('Consulta de usuários', function () {
    it('deve listar usuários cadastrados', async function () {
      const res = await request(server).get('/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.some(u => u.username === 'nathalia')).to.be.true;
      expect(res.body.some(u => u.username === 'bruno')).to.be.true;
    });
  });

  describe('Transferências', function () {
    it('deve transferir para favorecido (bruno)', async function () {
      const res = await request(server)
        .post('/transfers')
        .send({ remetente: 'nathalia', destinatario: 'bruno', valor: 10000 });
      expect(res.status).to.equal(201);
    });
    it('não deve transferir para não favorecido acima de 5000', async function () {
      const res = await request(server)
        .post('/transfers')
        .send({ remetente: 'bruno', destinatario: 'nathalia', valor: 6000 });
      expect(res.status).to.equal(403);
    });
    it('deve transferir para não favorecido abaixo de 5000', async function () {
      const res = await request(server)
        .post('/transfers')
        .send({ remetente: 'bruno', destinatario: 'nathalia', valor: 4999 });
      expect(res.status).to.equal(201);
    });
    it('deve listar transferências', async function () {
      const res = await request(server).get('/transfers');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });
});
