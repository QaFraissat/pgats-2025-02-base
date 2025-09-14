const users = require('../model/userModel');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function addUser(user) {
  users.push(user);
}

function getAllUsers() {
  return users;
}

module.exports = {
  findUserByUsername,
  addUser,
  getAllUsers
};
