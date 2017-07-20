import { Router } from 'express';

import actionHandler from '../handlers/actions';
import { ensureLoggedIn } from '../middlewares/auth';

const { actions } = actionHandler;

module.exports = (app) => {
  const router = Router();
  router.get('/:userId/actions', ensureLoggedIn, (req, res, next) => actions.find(req, res, next));
  app.use('/users', router);
  return app;
};
