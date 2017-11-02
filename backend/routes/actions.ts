import { Router } from 'express';

import actionHandler from '../handlers/actions';
import { ensureLoggedIn, getRequestedUser, getUserPermissions } from '../middlewares/auth';

const { actions } = <any>actionHandler;

export default (app) => {
  const router = Router();
  router.get('/:userId/actions', getRequestedUser, getUserPermissions, ensureLoggedIn, actions.find);
  app.use('/users', router);
  return app;
};
