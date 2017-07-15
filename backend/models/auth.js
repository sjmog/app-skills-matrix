const jwt = require('jsonwebtoken');
const adminUsers = require('../config.json').adminUsers;
const R = require('ramda');
const Promise = require('bluebird');

const isAdmin = email => R.contains(email, adminUsers);
const secret = process.env.JWT_SECRET;

module.exports = {
  sign: ({ id, username }) => jwt.sign({ id, username }, secret),
  verify: token => Promise.promisify(jwt.verify)(token, secret),
  isAdmin,
  cookieName: 'skillsmatrix-auth',
};
