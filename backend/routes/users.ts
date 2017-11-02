import { Router } from 'express';

import { ensureAdmin, getRequestedUser } from '../middlewares/auth';
import userHandler from '../handlers/users';
import createJUPHandler from './createJUPHandler';

const { users, user, evaluations } = <any>userHandler;

export default (app) => {
  const router = Router();
  router.post('/', ensureAdmin, ...createJUPHandler(users));
  router.post('/:userId', ensureAdmin, getRequestedUser, ...createJUPHandler(user));
  router.post('/:userId/evaluations', ensureAdmin, getRequestedUser, ...createJUPHandler(evaluations));
  app.use('/users', router);
  return app;
};
