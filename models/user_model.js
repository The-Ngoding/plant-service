// models/usersModel.js
const knex = require('knex')(require('../knexfile').development);

const UsersModel = {
  async getByUsername(username) {
    return knex('users').where('username', username).first();
  },

  async getByEmail(email) {
    return knex('users').where('email', email).first();
  },

  async create(user) {
    return knex('users').insert(user);
  },
};

module.exports = UsersModel;