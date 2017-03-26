const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById, updateEvaluation } = require('../models/evaluations');
const { getUserById } = require('../models/users');
const {
  EVALUATION_NOT_FOUND,
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR,
  MUST_BE_LOGGED_IN,
  SUBJECT_CANNOT_UPDATE_AFTER_SELF_EVALUATION,
  MENTOR_REVIEW_COMPLETE,
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION,
} = require('./errors');

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
              .then(({ mentorId }) =>
                (user.id === mentorId
                  ? res.status(200).json(evaluation.mentorEvaluationViewModel)
                  : res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR())));
          }

          return res.status(200).json(evaluation.subjectEvaluationViewModel);
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

          if (evaluation.mentorReviewCompleted()) {
            return res.status(403).json(MENTOR_REVIEW_COMPLETE())
          }

          if (user.id === evaluation.user.id) {
            return evaluation.selfEvaluationCompleted()
              ? res.status(403).json(SUBJECT_CANNOT_UPDATE_AFTER_SELF_EVALUATION())
              : updateEvaluation(evaluation.updateSkill(skillGroupId, skillId, status))
                .then(() => res.sendStatus(204));
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id !== mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              if (evaluation.selfEvaluationCompleted()) {
                return updateEvaluation(evaluation.updateSkill(skillGroupId, skillId, status))
                  .then(() => res.sendStatus(204))
              }

              return res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
            })
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

          if (evaluation.mentorReviewCompleted()) {
            return res.status(403).json(MENTOR_REVIEW_COMPLETE())
          }

          if (user.id === evaluation.user.id) {
            const completedApplication = evaluation.selfEvaluationComplete();
            return evaluation.selfEvaluationCompleted()
              ? res.status(403).json(SUBJECT_CANNOT_UPDATE_AFTER_SELF_EVALUATION())
              : updateEvaluation(completedApplication)
                .then((updatedEvaluation) => res.status(200).json({ status: updatedEvaluation.status }));
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id !== mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              if(evaluation.selfEvaluationCompleted()) {
                return updateEvaluation(evaluation.mentorReviewComplete())
                  .then((updatedEvaluation) => res.status(200).json({ status: updatedEvaluation.status }))
              }

              return res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION())
            });
        })
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
