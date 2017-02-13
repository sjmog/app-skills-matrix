const usersData = require('../fixtures/users');
const database = require('../../backend/database');
const users = database.collection('users');

module.exports = {
 prepopulate: () => Promise.all([
    users.remove({}),
  ]).then(() => Promise.all([
    users.insertMany(usersData),
  ])),
  users,
};
