const database = require('../database');
const adminUsers  = require('../config.json').adminUsers;
const R = require('ramda');

const users = database.collection('users');

const isAdmin = (user) => R.contains(user.email, adminUsers);
const unauthorizedPromise = () => Promise.reject(new Error('You don\'t have permissions to access'));

module.exports = {
  ensureAdmin: (user) => user && isAdmin(user)
    ? Promise.resolve() : unauthorizedPromise(),
  cookieName: 'skillsmatrix-auth'
};
