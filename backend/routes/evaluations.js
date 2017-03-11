const { Router } = require('express');

const { evaluation } = require('../handlers/evaluations');

module.exports = (app) => {
  const router = Router();

  router.post('/update-skill-status', evaluation.updateSkillStatus);
  router.get('/:evaluationId', evaluation.retrieve);
  app.use('/evaluations', router);

  return app
};