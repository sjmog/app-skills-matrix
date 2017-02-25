const { Router } = require('express');

const { evaluation } = require('../handlers/evaluations');

module.exports = (app) => {
  const router = Router();

  router.get('/:evaluationId', (req, res, next) => evaluation.retrieve(req, res, next));

  app.use('/evaluations', router);

  return app
};