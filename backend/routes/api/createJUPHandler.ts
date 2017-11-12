import * as R from 'ramda';
import * as compose from 'composable-middleware';
import { UNKNOWN_ACTION } from '../../handlers/errors';

const actionSpecificMiddleware = model =>
  (req, res, next) => {
    const middleware = R.path([req.body.action, 'middleware'], model) as any;
    const hasMiddleware = middleware && R.length(middleware) > 0;

    return hasMiddleware
      ? compose(...middleware)(req, res, next)
      : next();
  };

const handle = handler =>
  (req, res, next) => {
    const actionHandler = handler[req.body.action];
    if (!actionHandler) return res.status(400).json(UNKNOWN_ACTION());

    return actionHandler.handle
      ? actionHandler.handle(req, res, next)
      : actionHandler(req, res, next);
  };

export default (model) => {
  return [actionSpecificMiddleware(model), handle(model)];
};
