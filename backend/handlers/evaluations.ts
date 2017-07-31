import * as Promise from 'bluebird';

import createHandler from './createHandler';

import evaluations from '../models/evaluations/index';
import users from '../models/users/index';
import { User } from '../models/users/user';
import actions from '../models/actions/index';

import sendMail from '../services/email/index';

const {
  EVALUATION_NOT_FOUND,
  SKILL_NOT_FOUND,
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR,
  MUST_BE_LOGGED_IN_FOR_REQUEST,
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION,
  MENTOR_REVIEW_COMPLETE,
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION,
  USER_NOT_ADMIN,
} = require('./errors');

const addActions = (user: User, skill, evaluation, newStatus: string) => {
  const actionToAdd = skill.addAction(newStatus);
  const actionToRemove = skill.removeAction(newStatus);
  const fns = [];
  if (actionToAdd) {
    fns.push(actions.addAction(actionToAdd, user, skill, evaluation));
  }
  if (actionToRemove) {
    fns.push(actions.removeAction(actionToRemove, user.id, skill.id, evaluation.id));
  }
  return Promise.all(fns);
};

const handlerFunctions = Object.freeze({
  evaluation: {
    retrieve: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => evaluations.getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN_FOR_REQUEST());
          }

          if (user.id === evaluation.user.id) {
            return res.status(200).json(evaluation.subjectEvaluationViewModel());
          }

          return users.getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id === mentorId) {
                return res.status(200).json(evaluation.mentorEvaluationViewModel());
              }

              if (user.isAdmin()) {
                return res.status(200).json(evaluation.adminEvaluationViewModel());
              }

              return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
            });
        })
        .catch(next);
    },
    subjectUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => evaluations.getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN_FOR_REQUEST());
          }

          if (user.id !== evaluation.user.id) {
            return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          return evaluation.isNewEvaluation()
            ? evaluations.updateEvaluation(evaluation.updateSkill(skillId, status))
              .then(() => addActions(user, skill, evaluation, status))
              .then(() => res.sendStatus(204))
            : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
        })
        .catch(next);
    },
    mentorUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => evaluations.getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN_FOR_REQUEST());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          return users.getUserById(evaluation.user.id)
            .then((evalUser) => {
              if (user.id !== evalUser.mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? evaluations.updateEvaluation(evaluation.updateSkill(skillId, status))
                  .then(() => addActions(evalUser, skill, evaluation, status))
                  .then(() => res.sendStatus(204))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
            });
        })
        .catch(next);
    },
    adminUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => evaluations.getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN_FOR_REQUEST());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          if (user.isAdmin()) {
            return evaluations.updateEvaluation(evaluation.updateSkill(skillId, status))
              .then(() => users.getUserById(evaluation.user.id))
              .then(evalUser => addActions(evalUser, skill, evaluation, status))
              .then(() => res.sendStatus(204));
          }

          return res.status(403).json(USER_NOT_ADMIN());
        })
        .catch(next);
    },
    complete: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => evaluations.getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN_FOR_REQUEST());
          }

          if (evaluation.mentorReviewCompleted()) {
            return res.status(403).json(MENTOR_REVIEW_COMPLETE());
          }

          return users.getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id === evaluation.user.id) {
                const completedApplication = evaluation.selfEvaluationComplete();
                // TODO: @charlie - the isNewEvaluation logic should not be leaking out of evaluation.
                // If you can't update the evaluation then don't let selfEvaluationComplete return successfully.
                return evaluation.isNewEvaluation()
                  ? Promise.all([evaluations.updateEvaluation(completedApplication), users.getUserById(mentorId)])
                    .then(([updatedEvaluation, mentor]) => {
                      sendMail(updatedEvaluation.getSelfEvaluationCompleteEmail(mentor));
                      res.status(200).json({ status: updatedEvaluation.status });
                    })
                  : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
              }

              if (user.id !== mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? evaluations.updateEvaluation(evaluation.mentorReviewComplete())
                  .then(updatedEvaluation => res.status(200).json({ status: updatedEvaluation.status }))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
            });
        })
        .catch(next);
    },
  },
});

export default createHandler(handlerFunctions);
