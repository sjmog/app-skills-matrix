const R = require('ramda');
const Promise = require('bluebird');

const users = require('./users');

const clientState = (user, userList = []) => ({
  manageUsers: {
    users: R.map((domainUser) => domainUser.viewModel, userList),
  }
});

module.exports = function (user) {
  if (user && user.isAdmin) {
    return users.getAll()
      .then((allUsers) => clientState(user, allUsers));
  }
  return Promise.resolve(clientState(user));
};
