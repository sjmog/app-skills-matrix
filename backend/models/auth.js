const jwt = require('jsonwebtoken');
const database = require('../database');
const adminUsers = require('../config.json').adminUsers;
const R = require('ramda');

const isAdmin = (user) => R.contains(user.email, adminUsers);
const secret = process.env.JWT_SECRET;
const unauthorizedPromise = () => Promise.reject(new Error('You don\'t have permissions to access'));

module.exports = {
  sign: ({id, email}) => jwt.sign({ id, email }, secret),
  verify: token => new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, data) =>
      err ? reject(err) : resolve(data))),
  ensureOwner: (id, user) => user && isAdmin(user) || user.id === id
    ? Promise.resolve() : unauthorizedPromise(),
  ensureAdmin: (user) => user && isAdmin(user)
    ? Promise.resolve() : unauthorizedPromise(),
  cookieName: 'skillsmatrix-auth'
};
