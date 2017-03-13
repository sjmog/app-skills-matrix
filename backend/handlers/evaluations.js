const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById, updateEvaluation } = require('../models/evaluations');
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

          const updatedEvaluation = evaluation.updateSkill(skillGroupId, skillId, status);
          return updateEvaluation(updatedEvaluation)
            .then(() => res.sendStatus(204));
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

          const completedApplication = evaluation.complete();
          return updateEvaluation(completedApplication)
            .then(() => res.sendStatus(204));
        })
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
