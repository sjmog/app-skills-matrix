const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById, updateEvaluation } = require('../models/evaluations');
const { getUserById } = require('../models/users');
const { sendMail } = require('../services/email');

const {
  EVALUATION_NOT_FOUND,
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR,
  MUST_BE_LOGGED_IN,
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION,
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

          if (user.id === evaluation.user.id) {
            return res.status(200).json(evaluation.subjectEvaluationViewModel);
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) =>
              (user.id === mentorId
                ? res.status(200).json(evaluation.mentorEvaluationViewModel)
                : res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR())));
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
            return evaluation.isNewEvaluation()
              ? updateEvaluation(evaluation.updateSkill(skillGroupId, skillId, status))
                .then(() => res.sendStatus(204))
              : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id !== mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? updateEvaluation(evaluation.updateSkill(skillGroupId, skillId, status))
                  .then(() => res.sendStatus(204))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
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
            return evaluation.isNewEvaluation()
              ? Promise.all([updateEvaluation(completedApplication), getUserById(mentorId)])
                .then(([updatedEvaluation, mentor]) =>
                {
                  sendMail(updatedEvaluation.getSelfEvaluationCompleteEmail(mentor));
                  res.status(200).json({ status: updatedEvaluation.status })
                })
              : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id !== mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? updateEvaluation(evaluation.mentorReviewComplete())
                  .then((updatedEvaluation) => res.status(200).json({ status: updatedEvaluation.status }))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION())
            });
        })
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
