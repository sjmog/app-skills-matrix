const { Router } = require('express');

const { ensureAdmin } = require('../middlewares/auth');
const { templates, skills } = require('../handlers/matrices');

module.exports = (app) => {
  const router = Router();

  router.post('/templates', ensureAdmin, (req, res, next) => templates[req.body.action](req, res, next));
  router.post('/skills', ensureAdmin, (req, res, next) => skills[req.body.action](req, res, next));

  app.use('/matrices', router);

  return app
};
