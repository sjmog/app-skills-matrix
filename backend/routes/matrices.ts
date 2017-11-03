import { Router } from 'express';

import { ensureAdmin } from '../middlewares/auth';
import matricesHandler from '../handlers/matrices';
import createJUPHandler from './createJUPHandler';

const { templates, skills } = <any>matricesHandler;

export default (app) => {
  const router = Router();

  router.post('/templates', ensureAdmin, ...createJUPHandler(templates));
  router.get('/templates/:templateId', ensureAdmin, templates.retrieve);
  router.post('/templates/:templateId', ensureAdmin, ...createJUPHandler(templates));
  router.post('/skills', ensureAdmin, ...createJUPHandler(skills));
  router.get('/skills', ensureAdmin, skills.getAll);

  app.use('/matrices', router);

  return app;
};
