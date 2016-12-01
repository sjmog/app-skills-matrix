const skillsData = require('../fixtures/skills');
const usersData = require('../fixtures/users');

module.exports = {
 prepopulate: () => Promise.all([
    users.remove({}),
    skills.remove({})
  ]).then(() => Promise.all([
    users.insertMany(usersData),
    skills.insertMany(skillsData)
  ])),
  users,
  skills
};
