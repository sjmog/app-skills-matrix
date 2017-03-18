const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById, updateEvaluation } = require('../models/evaluations');
const { getUserById } = require('../models/users');
const { EVALUATION_NOT_FOUND, MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR, MUST_BE_LOGGED_IN } = require('./errors');

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

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (user.id !== evaluation.user.id) {
            return getUserById(evaluation.user.id)
              .then(({ mentorId }) => user.id === mentorId
                ? res.status(200).json(evaluation.userEvaluationViewModel)
                : res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR()));
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

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (user.id !== evaluation.user.id) {
            return getUserById(evaluation.user.id)
              .then(({ mentorId }) =>
                (user.id !== mentorId
                  ? res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR())
                  : updateEvaluation(evaluation.updateSkill(skillGroupId, skillId, status))
                    .then(() => res.sendStatus(204))));
          }

          return updateEvaluation(evaluation.updateSkill(skillGroupId, skillId, status))
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

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (user.id !== evaluation.user.id) {
            return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
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
