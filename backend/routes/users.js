const { Router } = require('express');

const { ensureAdmin } = require('../middlewares/auth');
const { users, user } = require('../handlers/users');

module.exports = (app) => {
  const router = Router();
  router.post('/', ensureAdmin, (req, res, next) => users[req.body.action](req, res, next));
  router.post('/:userId', (req, res, next) => user[req.body.action](req, res, next));
  app.use('/users', router);
  return app
};
