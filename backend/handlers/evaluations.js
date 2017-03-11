const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById, updateSkillStatus } = require('../models/evaluations');
const { EVALUATION_NOT_FOUND } = require('./errors');

const handlerFunctions = Object.freeze({
  evaluation: {
    retrieve: (req, res, next) => {
      Promise.try(() => getEvaluationById(req.params.evaluationId))
        .then(evaluation =>
          evaluation
            ? res.status(200).json(evaluation.userEvaluationViewModel)
            : res.status(404).json(EVALUATION_NOT_FOUND()))
        .catch(next);
    },
    updateSkillStatus: (req, res, next) => {
      const { evaluationId, skillGroupId, skillId, status } = req.body;

      Promise.try(() => updateSkillStatus(evaluationId, skillGroupId, skillId, status))
        .then(() => res.status(200).json({ skillId, status }))
        .catch(next)
    }
  }
});

module.exports = createHandler(handlerFunctions);
