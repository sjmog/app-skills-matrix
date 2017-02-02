const { Router } = require('express');

const { ensureAdmin } = require('../middlewares/auth');
const users = require('../handlers/users');

module.exports = (app) => {
  const router = Router();
  router.post('/', ensureAdmin, (req, res, next) => users.post[req.body.action](req, res, next));
  router.get('/', ensureAdmin, (req, res, next) => users.get(req, res, next));
  app.use('/users', router);
  return app
};
