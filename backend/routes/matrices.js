const { Router } = require('express');
const { templates, skills } = require('../handlers/matrices');

module.exports = (app) => {
  const router = Router();

  router.post('/templates', (req, res, next) => templates[req.body.action](req, res, next));
  router.post('/skills', (req, res, next) => skills[req.body.action](req, res, next));

  app.use('/', router);

  return app
};
