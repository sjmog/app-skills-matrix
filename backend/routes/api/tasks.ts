import { Router } from 'express';

import tasksHandler from '../../handlers/tasks';
import { ensureLoggedIn, getRequestedUser, getUserPermissions } from '../../middlewares/auth';

const { find } = <any>tasksHandler;

export default (app) => {
  const router = Router();
  router.get('/:userId', getRequestedUser, getUserPermissions, ensureLoggedIn, find);
  app.use('/tasks', router);
  return app;
};
