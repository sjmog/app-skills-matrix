const { Router } = require('express');

const { evaluation } = require('../handlers/evaluations');
const { ensureAdmin } = require('../middlewares/auth');

module.exports = (app) => {
  const router = Router();

  router.post('/:evaluationId', (req,res, next) => evaluation[req.body.action](req, res, next));
  router.get('/:evaluationId', (req,res, next) => evaluation.retrieve(req, res, next));
  router.post('/', (req, res, next) => evaluations[req.body.action](req, res, next));
  app.use('/evaluations', router);

  return app
};
