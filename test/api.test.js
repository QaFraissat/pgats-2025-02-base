const app = require('../rest/routes/app');
const request = require('supertest');
const { expect } = require('chai');

describe('API de Usuários e Transferências', function () {
  let server;
  before(function (done) {
    server = app.listen(4000, done);
  });
  after(function (done) {
    server.close(done);
  });

  it('deve registrar usuário nathalia', async function () {
    const res = await request(server)
      .post('/users/register')
      .send({ username: 'nathalia', password: '123456' });
    expect(res.status).to.be.oneOf([201, 409]);
  });

  it('deve registrar usuário bruno', async function () {
    const res = await request(server)
      .post('/users/register')
      .send({ username: 'bruno', password: '123456' });
    expect(res.status).to.be.oneOf([201, 409]);
  });

  it('deve logar com nathalia', async function () {
    const res = await request(server)
      .post('/users/login')
      .send({ username: 'nathalia', password: '123456' });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login realizado com sucesso.');
  });

  it('deve logar com bruno', async function () {
    const res = await request(server)
      .post('/users/login')
      .send({ username: 'bruno', password: '123456' });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login realizado com sucesso.');
  });

  it('deve listar usuários', async function () {
    const res = await request(server).get('/users');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.some(u => u.username === 'nathalia')).to.be.true;
    expect(res.body.some(u => u.username === 'bruno')).to.be.true;
  });

  it('deve recusar transferência > 5000 para não favorecido', async function () {
    const res = await request(server)
      .post('/transfers')
      .send({ remetente: 'nathalia', destinatario: 'bruno', valor: 6000 });
    expect(res.status).to.equal(403);
    expect(res.body.message).to.include('Transferências para não favorecidos');
  });

  it('deve aceitar transferência < 5000 para não favorecido', async function () {
    const res = await request(server)
      .post('/transfers')
      .send({ remetente: 'nathalia', destinatario: 'bruno', valor: 100 });
    expect(res.status).to.equal(201);
    expect(res.body.message).to.include('Transferência realizada com sucesso');
  });

  it('deve listar transferências', async function () {
    const res = await request(server).get('/transfers');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
