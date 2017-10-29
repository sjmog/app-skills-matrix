import { Router } from 'express';
import evaluationsHandler from '../handlers/evaluations';
import buildRequestHandler from './buildRequestHandler';

const { evaluation, evaluations } = <any>evaluationsHandler;

export default (app) => {
  const router = Router();

  router.post('/:evaluationId', ...buildRequestHandler(evaluation));
  router.get('/:evaluationId', ...evaluation.retrieve.middleware, evaluation.retrieve.handle);
  router.post('/', (req, res, next) => evaluations.import(req, res, next));
  app.use('/evaluations', router);

  return app;
};
