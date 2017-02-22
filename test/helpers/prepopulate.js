const usersData = require('../fixtures/users');
const templatesData = require('../fixtures/templates');
const database = require('../../backend/database');
const users = database.collection('users');
const templates = database.collection('templates');

module.exports = {
 prepopulate: () => Promise.all([
    users.remove({}),
    templates.remove({}),
  ]).then(() => Promise.all([
    users.insertMany(usersData),
    templates.insertMany(templatesData),
  ])),
  users,
  templates,
};
