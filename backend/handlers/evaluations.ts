import * as Promise from 'bluebird';
import * as validate from 'express-validation';
import * as Joi from 'joi';
import createHandler from './createHandler';
import { ensureLoggedIn, getRequestedEvaluation, getUserPermissions } from '../middlewares/auth';

import evaluations from '../models/evaluations/index';
import { Evaluation } from '../models/evaluations/evaluation';
import users from '../models/users/index';
import { User } from '../models/users/user';
import { Users } from '../models/users/users';
import actions from '../models/actions/index';
import notes from '../models/notes';
import { Notes } from '../models/notes/notes';

import sendMail from '../services/email/index';
import {
  NOT_AUTHORIZED_TO_ADD_NOTE,
  EVALUATION_NOT_FOUND,
  SKILL_NOT_FOUND,
  NOT_AUTHORIZED_TO_UPDATE_SKILL_STATUS,
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION,
  MENTOR_REVIEW_COMPLETE,
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION,
  USER_NOT_ADMIN,
  MUST_BE_NOTE_AUTHOR,
  NOTE_NOT_FOUND,
  NOT_AUTHORIZED_TO_MARK_EVAL_AS_COMPLETE,
} from './errors';

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

const authorize = (evalUserId: string, reqUser: User, notAuthorizedMsg: ErrorMessage): Promise<void> => {
  if (reqUser.isAdmin() || reqUser.id === evalUserId) {
    return Promise.resolve();
  }

  return users.getUserById(evalUserId)
    .then(({ mentorId }) => (
      reqUser.id === mentorId
        ? Promise.resolve()
        : Promise.reject({ status: 403, data: notAuthorizedMsg })));
};

const buildAggregateViewModel = (evaluation: Evaluation, retrievedNotes: Notes, retrievedUsers: Users, reqUser: User): Promise<HydratedEvaluationViewModel> => {
  const augment = viewModel => ({
    ...viewModel,
    users: retrievedUsers.normalizedViewModel(),
    notes: retrievedNotes.normalizedViewModel(),
  });

  if (reqUser.id === evaluation.user.id) {
    return Promise.resolve(augment(evaluation.subjectEvaluationViewModel()));
  }

  return users.getUserById(evaluation.user.id)
    .then(({ mentorId }) => {
      if (reqUser.id === mentorId) {
        return augment(evaluation.mentorEvaluationViewModel());
      }

      if (reqUser.isAdmin()) {
        return augment(evaluation.adminEvaluationViewModel());
      }
    });
};

const handlerFunctions = Object.freeze({
  evaluation: {
    retrieve: {
      middleware: [
        ensureLoggedIn,
        getRequestedEvaluation,
        getUserPermissions,
      ],
      handle: (req, res, next) => {
        const { user, permissions, requestedEvaluation } = res.locals;

        return permissions.viewEvaluation()
          .then(requestedEvaluation.getNoteIds)
          .then(notes.getNotes)
          .then(retrievedNotes =>
            users.getUsersById(retrievedNotes.getUserIds())
              .then(retrievedUsers => buildAggregateViewModel(requestedEvaluation, retrievedNotes, retrievedUsers, user)))
          .then(viewModel => res.status(200).json(viewModel))
          .catch(next);
      },
    },
    subjectUpdateSkillStatus: {
      middleware: [
        ensureLoggedIn,
      ],
      handle: (req, res, next) => {
        const { evaluationId } = req.params;
        const { skillId, status } = req.body;
        const { user } = res.locals;

        Promise.try(() => evaluations.getEvaluationById(evaluationId))
          .then((evaluation) => {
            if (!evaluation) {
              return res.status(404).json(EVALUATION_NOT_FOUND());
            }

            if (user.id !== evaluation.user.id) {
              return res.status(403).json(NOT_AUTHORIZED_TO_UPDATE_SKILL_STATUS());
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
    },
    mentorUpdateSkillStatus: {
      middleware: [
        ensureLoggedIn,
      ],
      handle: (req, res, next) => {
        const { evaluationId } = req.params;
        const { skillId, status } = req.body;
        const { user } = res.locals;

        Promise.try(() => evaluations.getEvaluationById(evaluationId))
          .then((evaluation) => {
            if (!evaluation) {
              return res.status(404).json(EVALUATION_NOT_FOUND());
            }

            const skill = evaluation.findSkill(skillId);
            if (!skill) {
              return res.status(400).json(SKILL_NOT_FOUND());
            }

            return users.getUserById(evaluation.user.id)
              .then((evalUser) => {
                if (user.id !== evalUser.mentorId) {
                  return res.status(403).json(NOT_AUTHORIZED_TO_UPDATE_SKILL_STATUS());
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
    },
    adminUpdateSkillStatus: {
      middleware: [
        ensureLoggedIn,
      ],
      handle: (req, res, next) => {
        const { evaluationId } = req.params;
        const { skillId, status } = req.body;
        const { user } = res.locals;

        Promise.try(() => evaluations.getEvaluationById(evaluationId))
          .then((evaluation) => {
            if (!evaluation) {
              return res.status(404).json(EVALUATION_NOT_FOUND());
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
    },
    complete: {
      middleware: [
        ensureLoggedIn,
      ],
      handle: (req, res, next) => {
        const { evaluationId } = req.params;
        const { user } = res.locals;

        Promise.try(() => evaluations.getEvaluationById(evaluationId))
          .then((evaluation) => {
            if (!evaluation) {
              return res.status(404).json(EVALUATION_NOT_FOUND());
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
                        res.status(200).json(updatedEvaluation.subjectMetadataViewModel());
                      })
                    : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
                }

                if (user.id !== mentorId) {
                  return res.status(403).json(NOT_AUTHORIZED_TO_MARK_EVAL_AS_COMPLETE());
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
    addNote: {
      middleware: [
        ensureLoggedIn,
        validate({
          params: {
            evaluationId: Joi.string().required(),
          },
          body: {
            note: Joi.string().required(),
            skillId: Joi.number().required(),
          },
        }),
      ],
      handle: (req, res, next) => {
        const { evaluationId } = req.params;
        const { skillId, note: noteText } = req.body;
        const { user } = res.locals;

        Promise.try(() => evaluations.getEvaluationById(evaluationId))
          .then((evaluation) => {

            if (!evaluation) {
              return res.status(404).json(EVALUATION_NOT_FOUND());
            }

            const skill = evaluation.findSkill(skillId);
            if (!skill) {
              return res.status(400).json(SKILL_NOT_FOUND());
            }

            return authorize(evaluation.user.id, user, NOT_AUTHORIZED_TO_ADD_NOTE())
              .then(() => notes.addNote(user.id, skillId, noteText))
              .then(note =>
                evaluations.updateEvaluation(evaluation.addSkillNote(skillId, note.id))
                  .then(() => res.status(200).json(note.viewModel())));
          })
          .catch(err =>
            (err.status && err.data) ? res.status(err.status).json(err.data) : next(err));
      },
    },
    deleteNote: {
      middleware: [
        ensureLoggedIn,
        validate({
          params: {
            evaluationId: Joi.string().required(),
          },
          body: {
            noteId: Joi.string().required(),
            skillId: Joi.number().required(),
          },
        }),
      ],
      handle: (req, res, next) => {
        const { evaluationId } = req.params;
        const { skillId, noteId } = req.body;
        const { user } = res.locals;

        Promise.try(() => notes.getNote(noteId))
          .then((note) => {
            if (!note) {
              return res.status(404).json(NOTE_NOT_FOUND());
            }

            if (note.userId !== user.id) {
              return res.status(403).json(MUST_BE_NOTE_AUTHOR());
            }

            return evaluations.getEvaluationById(evaluationId)
              .then((evaluation) => {
                if (!evaluation) {
                  throw ({ status: 404, data: EVALUATION_NOT_FOUND() });
                }

                const skill = evaluation.findSkill(skillId);
                if (!skill) {
                  throw ({ status: 404, data: SKILL_NOT_FOUND() });
                }

                return evaluations.updateEvaluation(evaluation.deleteSkillNote(skillId, noteId));
              })
              .then(() => notes.updateNote(note.setDeletedFlag()))
              .then(() => res.sendStatus(204));
          })
          .catch(err =>
            (err.status && err.data) ? res.status(err.status).json(err.data) : next(err));
      },
    },
  },
});

export default createHandler(handlerFunctions);
