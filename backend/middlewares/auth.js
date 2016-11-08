const auth = require('../models/auth')

module.exports = {
  populateUser: (req, res, next) => 
    req.cookies[auth.cookieName] 
    ? auth.verify(req.cookies[auth.cookieName])
        .then(data => {
          res.locals.user = data
          next()
        })
        .catch(next)
    : next(),
  ensureAdmin: (req, res, next) => 
    auth.ensureAdmin(res.locals.user)
      .then(next)
      .catch(({ message, stack }) => 
        res.status(403).json({ message, stack })),
  ensureOwner: (req, res, next) =>
    auth.ensureOwner(req.params.id, res.locals.user)
      .then(next)
      .catch(({ message, stack }) => 
        res.status(403).json({ message, stack }))
}
