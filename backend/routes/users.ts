import { Router } from 'express';

import { ensureAdmin } from '../middlewares/auth';
import userHandler from '../handlers/users';

const { users, user, evaluations } = <any>userHandler;

export default (app) => {
  const router = Router();
  router.post('/', ensureAdmin, (req, res, next) => users[req.body.action](req, res, next));
  router.post('/:userId', (req, res, next) => user[req.body.action](req, res, next));
  router.post('/:userId/evaluations', ensureAdmin, (req, res, next) => evaluations[req.body.action](req, res, next));
  app.use('/users', router);
  return app;
};
