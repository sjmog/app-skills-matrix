import * as jwt from 'jsonwebtoken';
import * as R from 'ramda';
import * as Promise from 'bluebird';

const adminUsers = process.env.ADMIN_EMAILS.split(' ');
const secret = process.env.JWT_SECRET;

const isAdmin = email => R.contains(email, adminUsers);

export default {
  sign: ({ id, username }) => jwt.sign({ id, username }, secret),
  verify: token => Promise.promisify(jwt.verify)(token, secret),
  isAdmin,
  cookieName: 'skillsmatrix-auth',
};
