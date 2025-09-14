const express = require('express');
const router = express.Router();
const transferService = require('../service/transferService');
const userService = require('../service/userService');

// Transferência de valores
router.post('/', (req, res) => {
  const { remetente, destinatario, valor } = req.body;
  if (!remetente || !destinatario || typeof valor !== 'number') {
    return res.status(400).json({ message: 'Remetente, destinatário e valor são obrigatórios.' });
  }
  const remetenteUser = userService.findUserByUsername(remetente);
  const destinatarioUser = userService.findUserByUsername(destinatario);
  if (!remetenteUser || !destinatarioUser) {
    return res.status(404).json({ message: 'Remetente ou destinatário não encontrado.' });
  }
  const isFavorecido = remetenteUser.favorecidos && remetenteUser.favorecidos.includes(destinatario);
  if (!isFavorecido && valor > 5000) {
    return res.status(403).json({ message: 'Transferências para não favorecidos só podem ser de até R$ 5.000,00.' });
  }
  transferService.addTransfer({ remetente, destinatario, valor, data: new Date() });
  res.status(201).json({ message: 'Transferência realizada com sucesso.' });
});

// Consulta de transferências
router.get('/', (req, res) => {
  res.json(transferService.getTransfers());
});

module.exports = router;
