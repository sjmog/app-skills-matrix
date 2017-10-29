import { Router } from 'express';
import * as compose from 'composable-middleware';
import * as R from 'ramda';

import { ensureAdmin, getRequestedUser } from '../middlewares/auth';
import userHandler from '../handlers/users';
import { UNKNOWN_ACTION } from '../handlers/errors';

const { users, user, evaluations } = <any>userHandler;

const actionSpecificMiddleware = (req, res, next) => {
  const middleware = R.path([req.body.action, 'middleware'], user) as any;
  const hasMiddleware = middleware && R.length(middleware) > 0;

  return hasMiddleware
    ? compose(...middleware)(req, res, next)
    : next();
};

const handle =  (req, res, next) => {
  const handle = R.path([req.body.action, 'handle'], user) as any;

  return handle
    ? handle(req, res, next)
    : res.status(400).json(UNKNOWN_ACTION());
};

export default (app) => {
  const router = Router();
  router.post('/', ensureAdmin, (req, res, next) => users[req.body.action](req, res, next));
  router.post('/:userId', ensureAdmin, getRequestedUser, actionSpecificMiddleware, handle);
  router.post('/:userId/evaluations', ensureAdmin, getRequestedUser, (req, res, next) => evaluations[req.body.action](req, res, next));
  app.use('/users', router);
  return app;
};
