const auth = require('../models/auth');
const users = require('../models/users');
const { MUST_BE_ADMIN, MUST_BE_LOGGED_IN } = require('../handlers/errors');

module.exports = {
  populateUser: (req, res, next) =>
    req.cookies[auth.cookieName] ?
      auth.verify(req.cookies[auth.cookieName])
        .then(data =>
          users.getUserByEmail(data.email)
            .then((user) => {
              res.locals.user = user;
              next()
            }))
        .catch(next) :
      next(),
  ensureAdmin: (req, res, next) => {
    if (!res.locals.user) {
      return res.status(401).json(MUST_BE_LOGGED_IN())
    }
    res.locals.user && res.locals.user.isAdmin ?
      next() :
      res.status(403).json(MUST_BE_ADMIN())
  },
};
