import * as Promise from 'bluebird';
import * as validate from 'express-validation';
import * as Joi from 'joi';
import createHandler, { Locals } from './createHandler';
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
  SKILL_NOT_FOUND,
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION,
  MENTOR_REVIEW_COMPLETE,
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION,
  MUST_BE_NOTE_AUTHOR,
  NOTE_NOT_FOUND,
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

const buildAggregateViewModel = (evaluation: Evaluation, retrievedNotes: Notes, retrievedUsers: Users, reqUser: User, evaluationUser: User): Promise<HydratedEvaluationViewModel> => {
  const augment = viewModel => ({
    ...viewModel,
    users: retrievedUsers.normalizedViewModel(),
    notes: retrievedNotes.normalizedViewModel(),
  });

  if (reqUser.id === evaluation.user.id) {
    return augment(evaluation.subjectEvaluationViewModel());
  }

  if (reqUser.id === evaluationUser.mentorId) {
    return augment(evaluation.mentorEvaluationViewModel());
  }

  if (reqUser.isAdmin()) {
    return augment(evaluation.adminEvaluationViewModel());
  }
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
        const { user, permissions, requestedEvaluation, evaluationUser } = <Locals>res.locals;

        return permissions.viewEvaluation()
          .then(requestedEvaluation.getNoteIds)
          .then(notes.getNotes)
          .then(retrievedNotes =>
            users.getUsersById(retrievedNotes.getUserIds())
              .then(retrievedUsers => buildAggregateViewModel(requestedEvaluation, retrievedNotes, retrievedUsers, user, evaluationUser)))
          .then(viewModel => res.status(200).json(viewModel))
          .catch(next);
      },
    },
    subjectUpdateSkillStatus: {
      middleware: [
        ensureLoggedIn,
        getRequestedEvaluation,
        getUserPermissions,
      ],
      handle: (req, res, next) => {
        const { skillId, status } = req.body;
        const { user, permissions, requestedEvaluation } = <Locals>res.locals;

        const skill = requestedEvaluation.findSkill(skillId);
        if (!skill) {
          return res.status(400).json(SKILL_NOT_FOUND());
        }

        // TODO: this needs to be moved into requestedEvaluation.updateSkill(...)
        // will do this once I'm done the rest of the permission model
        if (!requestedEvaluation.isNewEvaluation()) {
          return res.status(400).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
        }

        permissions.updateSkill()
          .then(() => evaluations.updateEvaluation(requestedEvaluation.updateSkill(skillId, status)))
          .then(() => addActions(user, skill, requestedEvaluation, status))
          .then(() => res.sendStatus(204))
          .catch(next);
      },
    },
    mentorUpdateSkillStatus: {
      middleware: [
        ensureLoggedIn,
        getRequestedEvaluation,
        getUserPermissions,
      ],
      handle: (req, res, next) => {
        const { skillId, status } = req.body;
        const { evaluationUser, permissions, requestedEvaluation } = <Locals>res.locals;


        const skill = requestedEvaluation.findSkill(skillId);
        if (!skill) {
          return res.status(400).json(SKILL_NOT_FOUND());
        }

        // TODO: this needs to be moved into requestedEvaluation.updateSkill(...)
        // will do this once I'm done the rest of the permission model
        if (!requestedEvaluation.selfEvaluationCompleted()) {
          return res.status(400).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
        }

        permissions.updateSkill()
          .then(() => evaluations.updateEvaluation(requestedEvaluation.updateSkill(skillId, status)))
          .then(() => addActions(evaluationUser, skill, requestedEvaluation, status))
          .then(() => res.sendStatus(204))
          .catch(next);
      },
    },
    adminUpdateSkillStatus: {
      middleware: [
        ensureLoggedIn,
        getRequestedEvaluation,
        getUserPermissions,
      ],
      handle:
        (req, res, next) => {
          const { skillId, status } = req.body;
          const { evaluationUser, permissions, requestedEvaluation } = <Locals>res.locals;

          const skill = requestedEvaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          return permissions.admin()
            .then(() => evaluations.updateEvaluation(requestedEvaluation.updateSkill(skillId, status)))
            .then(() => addActions(evaluationUser, skill, requestedEvaluation, status))
            .then(() => res.sendStatus(204))
            .catch(next);
        },
    },
    complete: {
      middleware: [
        ensureLoggedIn,
        getRequestedEvaluation,
        getUserPermissions,
      ],
      handle:
        (req, res, next) => {
          const { user, requestedEvaluation, evaluationUser, permissions } = <Locals>res.locals;

          if (requestedEvaluation.mentorReviewCompleted()) {
            return res.status(400).json(MENTOR_REVIEW_COMPLETE());
          }

          permissions.completeEvaluation()
            .then(() => {
              if (user.id === evaluationUser.id) {
                const completedApplication = requestedEvaluation.selfEvaluationComplete();
                // TODO: See above todo
                return requestedEvaluation.isNewEvaluation()
                  ? Promise.all([evaluations.updateEvaluation(completedApplication), users.getUserById(evaluationUser.mentorId)])
                    .then(([updatedEvaluation, mentor]) => {
                      sendMail(updatedEvaluation.getSelfEvaluationCompleteEmail(mentor));
                      res.status(200).json(updatedEvaluation.subjectMetadataViewModel());
                    })
                  : res.status(400).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
              }

              return requestedEvaluation.selfEvaluationCompleted()
                ? evaluations.updateEvaluation(requestedEvaluation.mentorReviewComplete())
                  .then(updatedEvaluation => res.status(200).json({ status: updatedEvaluation.status }))
                : res.status(400).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
            })
            .catch(next);
        },
    },
    addNote: {
      middleware: [
        ensureLoggedIn,
        getRequestedEvaluation,
        getUserPermissions,
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
      handle:
        (req, res, next) => {
          const { skillId, note: noteText } = req.body;
          const { user, requestedEvaluation, permissions } = <Locals>res.locals;

          const skill = requestedEvaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          permissions.addNote()
            .then(() => notes.addNote(user.id, skillId, noteText))
            .then(note =>
              evaluations.updateEvaluation(requestedEvaluation.addSkillNote(skillId, note.id))
                .then(() => res.status(200).json(note.viewModel())))
            .catch(next);
        },
    },
    deleteNote: {
      middleware: [
        ensureLoggedIn,
        getRequestedEvaluation,
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
      handle:
        (req, res, next) => {
          const { skillId, noteId } = req.body;
          const { user, requestedEvaluation } = <Locals>res.locals;

          Promise.try(() => notes.getNote(noteId))
            .then((note) => {
              if (!note) {
                return res.status(400).json(NOTE_NOT_FOUND());
              }

              // not part of the permission model - could do, but it adds complexity that might not be worth it
              if (note.userId !== user.id) {
                return res.status(403).json(MUST_BE_NOTE_AUTHOR());
              }

              const skill = requestedEvaluation.findSkill(skillId);
              if (!skill) {
                throw ({ status: 400, data: SKILL_NOT_FOUND() });
              }

              return evaluations.updateEvaluation(requestedEvaluation.deleteSkillNote(skillId, noteId))
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
