import * as R from 'ramda';
import * as compose from 'composable-middleware';
import { UNKNOWN_ACTION } from '../handlers/errors';

const actionSpecificMiddleware = model =>
  (req, res, next) => {
  const middleware = R.path([req.body.action, 'middleware'], model) as any;
  const hasMiddleware = middleware && R.length(middleware) > 0;

  return hasMiddleware
    ? compose(...middleware)(req, res, next)
    : next();
};

const handle = model =>
  (req, res, next) => {
  const handle = R.path([req.body.action, 'handle'], model) as any;

  return handle
    ? handle(req, res, next)
    : res.status(400).json(UNKNOWN_ACTION());
};

export default (model) => {
  return [actionSpecificMiddleware(model), handle(model)];
};
