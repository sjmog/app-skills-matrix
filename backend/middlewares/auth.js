const auth = require('../models/auth');
const users = require('../models/users');

module.exports = {
  populateUser: (req, res, next) =>
    req.cookies[auth.cookieName] ?
      auth.verify(req.cookies[auth.cookieName])
        .then(data => {
          users.getUser(data.email)
            .then((user) => {
              res.locals.user = user;
              next()
            })
        })
        .catch(next) :
      next(),
  ensureAdmin: (req, res, next) => res.locals.user.isAdmin ?
    next() :
    res.status(403).json({ message: `User '${res.locals.user}' does not have admin access` }),
};
