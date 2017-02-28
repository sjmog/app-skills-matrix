const usersData = require('../fixtures/users');
const templatesData = require('../fixtures/templates');
const database = require('../../backend/database');
const users = database.collection('users');
const templates = database.collection('templates');
const evaluations = database.collection('evaluations');

module.exports = {
 prepopulate: () => Promise.all([
    users.remove({}),
    templates.remove({}),
    evaluations.remove({}),
  ]).then(() => Promise.all([
    users.insertMany(usersData),
    templates.insertMany(templatesData),
  ])),
  users,
  templates,
  evaluations,
};
