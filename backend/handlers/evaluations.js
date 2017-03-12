const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById, updateSkillStatus, complete } = require('../models/evaluations');
const { EVALUATION_NOT_FOUND, MUST_BE_EVALUATION_TARGET } = require('./errors');

const handlerFunctions = Object.freeze({
  evaluation: {
    retrieve: (req, res, next) => {
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(req.params.evaluationId))
        .then(evaluation => {
          if (!evaluation) {
            res.status(404).json(EVALUATION_NOT_FOUND());
          } else if ((user && user.id) !== evaluation.user.id) {
            res.status(403).json(MUST_BE_EVALUATION_TARGET());
          } else {
            res.status(200).json(evaluation.userEvaluationViewModel);
          }
        })
        .catch(next);
    },
    updateSkillStatus: (req, res, next) => {
      const { evaluationId, skillGroupId, skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            res.status(404).json(EVALUATION_NOT_FOUND());
          } else if ((user && user.id) !== evaluation.user.id) {
            res.status(403).json(MUST_BE_EVALUATION_TARGET());
          } else {
            return updateSkillStatus(evaluation, skillGroupId, skillId, status)
              .then(() => res.status(200).json({ skillId, status }));
          }
        })
        .catch(next)
    },
    complete: (req, res, next) => {
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(req.params.evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            res.status(404).json(EVALUATION_NOT_FOUND());
          } else if ((user && user.id) !== evaluation.user.id) {
            res.status(403).json(MUST_BE_EVALUATION_TARGET());
          } else {
            return complete(evaluation)
              .then((completedEval) => res.status(200).json(completedEval.viewModel));
          }
        })
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
