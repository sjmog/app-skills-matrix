const { Router } = require('express');

const { evaluation } = require('../handlers/evaluations');

module.exports = (app) => {
  const router = Router();

  router.post('/:evaluationId/update-skill-status', evaluation.updateSkillStatus);
  router.post('/:evaluationId/complete', evaluation.complete);
  router.get('/:evaluationId', evaluation.retrieve);
  app.use('/evaluations', router);

  return app
};