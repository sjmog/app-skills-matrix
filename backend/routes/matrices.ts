import { Router } from 'express';

import { ensureAdmin } from '../middlewares/auth';
import matricesHandler from '../handlers/matrices';

const { templates, skills } = <any>matricesHandler;

export default (app) => {
  const router = Router();

  router.post('/templates', ensureAdmin, (req, res, next) => templates[req.body.action](req, res, next));
  router.get('/templates/:templateId', ensureAdmin, (req, res, next) => templates.retrieve(req, res, next));
  router.post('/skills', ensureAdmin, (req, res, next) => skills[req.body.action](req, res, next));
  router.get('/skills', ensureAdmin, (req, res, next) => skills.getAll(req, res, next));

  app.use('/matrices', router);

  return app;
};
