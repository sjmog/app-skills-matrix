import auth from '../models/auth';
import users from '../models/users';
import { MUST_BE_ADMIN, MUST_BE_LOGGED_IN } from '../handlers/errors';

export const populateUser = (req, res, next) =>
  (req.cookies[auth.cookieName] ? auth.verify(req.cookies[auth.cookieName])
    .then(data =>
      users.getUserByUsername(data.username)
        .then((user) => {
          res.locals.user = user;
          next();
        }))
    .catch(next) : next());

export const ensureLoggedIn = (req, res, next) => (!res.locals.user ? res.status(401).json(MUST_BE_LOGGED_IN()) : next());
export const ensureAdmin = (req, res, next) => {
  if (!res.locals.user) {
    return res.status(401).json(MUST_BE_LOGGED_IN());
  }
  return res.locals.user && res.locals.user.isAdmin() ? next() : res.status(403).json(MUST_BE_ADMIN());
};
