import { Router } from 'express';
import * as compose from 'composable-middleware';
import evaluationsHandler from '../handlers/evaluations';

const { evaluation, evaluations } = <any>evaluationsHandler;

const middleware = (req, res, next) =>
  compose(...evaluation[req.body.action].middleware)(req, res, next);

const handle =  (req, res, next) =>
  evaluation[req.body.action].handle(req, res, next);

export default (app) => {
  const router = Router();

  router.post('/:evaluationId', middleware, handle);
  router.get('/:evaluationId', ...evaluation.retrieve.middleware, evaluation.retrieve.handle);
  router.post('/', (req, res, next) => evaluations.import(req, res, next));
  app.use('/evaluations', router);

  return app;
};
