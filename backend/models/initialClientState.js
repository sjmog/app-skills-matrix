const R = require('ramda');
const Promise = require('bluebird');

const users = require('./users');
const { templates }= require('./matrices');

const clientState = (user, userList = [], templates = []) => ({
  manageUsers: {
    users: R.map((domainUser) => domainUser.viewModel, userList),
    templates: R.map((domainTemplate) => domainTemplate.viewModel, templates),
    newEvaluations: [],
  }
});

module.exports = function (user) {
  if (user && user.isAdmin) {
    return Promise.all([users.getAll(), templates.getAll()])
      .then(([allUsers, allTemplates]) => clientState(user, allUsers, allTemplates));
  }
  return Promise.resolve(clientState(user));
};
