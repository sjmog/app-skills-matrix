import { Router } from 'express';

import { ensureAdmin, getRequestedUser } from '../middlewares/auth';
import userHandler from '../handlers/users';
import buildRequestHandler from './buildRequestHandler';

const { users, user, evaluations } = <any>userHandler;

export default (app) => {
  const router = Router();
  router.post('/', ensureAdmin, (req, res, next) => users[req.body.action](req, res, next));
  router.post('/:userId', ensureAdmin, getRequestedUser, ...buildRequestHandler(user));
  router.post('/:userId/evaluations', ensureAdmin, getRequestedUser, (req, res, next) => evaluations[req.body.action](req, res, next));
  app.use('/users', router);
  return app;
};
