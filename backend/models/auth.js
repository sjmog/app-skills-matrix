const jwt = require('jsonwebtoken');
const database = require('../database');
const adminUsers = require('../config.json').adminUsers;
const R = require('ramda');

const isAdmin = (email) => R.contains(email, adminUsers);
const secret = process.env.JWT_SECRET;

module.exports = {
  sign: ({id, username}) => jwt.sign({ id, username }, secret),
  verify: token => new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, data) =>
      err ? reject(err) : resolve(data))),
  isAdmin,
  cookieName: 'skillsmatrix-auth'
};
