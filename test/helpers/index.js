const usersData = require('../fixtures/users');
const database = require('../../backend/database');

const users = database.collection('users');
const templates = database.collection('templates');
const skills = database.collection('skills');

module.exports = {
 prepopulateUsers: () =>
    users.remove({})
      .then(() => users.insertMany(usersData)),
  users,
  templates,
  insertTemplate: (template) => templates.insertOne(template),
  skills,
  insertSkill: (skill) => skills.insertOne(skill),
};
