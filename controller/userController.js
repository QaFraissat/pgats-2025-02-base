const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

// Registro de usuário
router.post('/register', (req, res) => {
  const { username, password, favorecidos = [] } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  if (userService.findUserByUsername(username)) {
    return res.status(409).json({ message: 'Usuário já existe.' });
  }
  userService.addUser({ username, password, favorecidos });
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  const user = userService.findUserByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
  }
  res.json({ message: 'Login realizado com sucesso.' });
});

// Consulta de usuários
router.get('/', (req, res) => {
  const users = userService.getAllUsers().map(u => ({ username: u.username, favorecidos: u.favorecidos }));
  res.json(users);
});

module.exports = router;
