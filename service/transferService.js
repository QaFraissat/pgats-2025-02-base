const transfers = require('../model/transferModel');
const users = require('../model/userModel');

function addTransfer(transfer) {
  transfers.push(transfer);
}

function getUserByUsername(username) {
  return users.find(u => u.username === username);
}

function getTransfers() {
  return transfers;
}

module.exports = {
  addTransfer,
  getUserByUsername,
  getTransfers
};
