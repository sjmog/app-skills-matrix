import * as jwt from 'jsonwebtoken';
import * as R from 'ramda';
import * as Promise from 'bluebird';
import config from '../config';

const adminUsers = config.adminUsers;

const isAdmin = email => R.contains(email, adminUsers);
const secret = process.env.JWT_SECRET;

export default {
  sign: ({ id, username }) => jwt.sign({ id, username }, secret),
  verify: token => Promise.promisify(jwt.verify)(token, secret),
  isAdmin,
  cookieName: 'skillsmatrix-auth',
};
