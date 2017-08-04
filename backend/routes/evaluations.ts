import { Router } from 'express';
import evaluationsHandler from '../handlers/evaluations';

const { evaluation, evaluations } = <any>evaluationsHandler;

export default (app) => {
  const router = Router();

  router.post('/:evaluationId', (req, res, next) => evaluation[req.body.action](req, res, next));
  router.get('/:evaluationId', (req, res, next) => evaluation.retrieve(req, res, next));
  router.post('/', (req, res, next) => evaluations.import(req, res, next));
  app.use('/evaluations', router);

  return app;
};
