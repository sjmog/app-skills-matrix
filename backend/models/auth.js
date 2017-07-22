import jwt from 'jsonwebtoken';
import R from 'ramda';
import Promise from 'bluebird';
import config from '../config.json';

const adminUsers = config.adminUsers;

const isAdmin = email => R.contains(email, adminUsers);
const secret = process.env.JWT_SECRET;

module.exports = {
  sign: ({ id, username }) => jwt.sign({ id, username }, secret),
  verify: token => Promise.promisify(jwt.verify)(token, secret),
  isAdmin,
  cookieName: 'skillsmatrix-auth',
};
