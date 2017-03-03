const R = require('ramda');
const Promise = require('bluebird');

const users = require('./users');
const { templates }= require('./matrices');

const adminClientState = () => {
  return Promise.all([users.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) => ({
      manageUsers: {
        users: R.map((domainUser) => domainUser.manageUserViewModel, allUsers),
        templates: R.map((domainTemplate) => domainTemplate.viewModel, allTemplates),
        newEvaluations: [],
      }
    }));
};

const clientState = (user) =>
  Promise.resolve({
    dashboard: {
      user: user ? user.userDetailsViewModel : undefined
    }
  });

module.exports = {
  adminClientState,
  clientState,
};
