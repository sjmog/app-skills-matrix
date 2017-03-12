const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById, updateSkillStatus, complete } = require('../models/evaluations');
const { EVALUATION_NOT_FOUND, MUST_BE_SUBJECT_OF_EVALUATION } = require('./errors');

const handlerFunctions = Object.freeze({
  evaluation: {
    retrieve: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then(evaluation => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if ((user && user.id) !== evaluation.user.id) {
            return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION());
          }

          return res.status(200).json(evaluation.userEvaluationViewModel);
        })
        .catch(next);
    },
    updateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillGroupId, skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if ((user && user.id) !== evaluation.user.id) {
            return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION());
          }

          return updateSkillStatus(evaluation, skillGroupId, skillId, status)
            .then(() => res.status(200).json({ skillId, status }));
        })
        .catch(next)
    },
    complete: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if ((user && user.id) !== evaluation.user.id) {
            return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION());
          }

          return complete(evaluation)
            .then((completedEval) => res.status(200).json(completedEval.viewModel));
        })
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
