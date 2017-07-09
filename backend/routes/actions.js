const { Router } = require('express');

const { actions } = require('../handlers/actions');
const { ensureLoggedIn } = require('../middlewares/auth');

module.exports = (app) => {
  const router = Router();
  router.get('/:userId/actions', ensureLoggedIn, (req, res, next) => actions.find(req, res, next));
  app.use('/users', router);
  return app;
};
