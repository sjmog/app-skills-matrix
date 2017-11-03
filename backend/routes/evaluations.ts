import { Router } from 'express';

import { ensureLoggedIn, getRequestedEvaluation, getUserPermissions } from '../middlewares/auth';
import evaluationsHandler from '../handlers/evaluations';
import createJUPHandler from './createJUPHandler';

const { evaluation, evaluations } = <any>evaluationsHandler;

export default (app) => {
  const router = Router();

  router.post('/:evaluationId', ...createJUPHandler(evaluation));
  router.get('/:evaluationId',  ensureLoggedIn, getRequestedEvaluation, getUserPermissions, evaluation.retrieve);
  router.post('/', (req, res, next) => evaluations.import(req, res, next));
  app.use('/evaluations', router);

  return app;
};
