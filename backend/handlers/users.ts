import * as Promise from 'bluebird';

import users from '../models/users/index';
import matrices from '../models/matrices/index';
import { newEvaluation, Evaluation } from '../models/evaluations/evaluation';
import evaluations from '../models/evaluations/index';
import createHandler from './createHandler';
import sendMail from '../services/email/index';
import {
  USER_EXISTS,
  TEMPLATE_NOT_FOUND,
  USER_HAS_NO_TEMPLATE,
  USER_HAS_NO_MENTOR,
} from './errors';

const { templates, skills } = matrices;

const handlerFunctions = Object.freeze({
  users: {
    create: (req, res, next) => {
      Promise.try(() => users.getUserByUsername(req.body.username))
        .then((user) => {
          if (user) {
            return res.status(409).json(USER_EXISTS(req.body.username));
          }
          return users.addUser(req.body)
            .then(u => res.status(201).send(u.manageUserViewModel()));
        })
        .catch(next);
    },
  },
  user: {
    selectMentor: (req, res, next) => {
      const { requestedUser } = res.locals;
      const changes = requestedUser.setMentor(req.body.mentorId);
      if (changes.error) {
        return res.status(400).json(changes);
      }
      return users.updateUser(requestedUser, changes)
        .then(updatedUser => res.status(200).json(updatedUser.manageUserViewModel()))
        .catch(next);
    },
    selectLineManager: (req, res, next) => {
      const { requestedUser } = res.locals;
      const changes = requestedUser.setLineManager(req.body.lineManagerId);
      if (changes.error) {
        return res.status(400).json(changes);
      }
      return users.updateUser(requestedUser, changes)
        .then(updatedUser => res.status(200).json(updatedUser.manageUserViewModel()))
        .catch(next);
    },
    selectTemplate: (req, res, next) => {
      const { requestedUser } = res.locals;

      Promise.try(() => templates.getById(req.body.templateId))
        .then((template) => {
          if (!template) {
            return res.status(400).json(TEMPLATE_NOT_FOUND());
          }

          const changes = requestedUser.setTemplate(req.body.templateId);
          return users.updateUser(requestedUser, changes)
            .then(updatedUser => res.status(200).json(updatedUser.manageUserViewModel()));
        })
        .catch(next);
    },
  },
  evaluations: {
    create: (req, res, next) => {
      const { requestedUser } = res.locals;

      if (!requestedUser.hasTemplate) {
        return res.status(400).json(USER_HAS_NO_TEMPLATE(requestedUser.manageUserViewModel().name));
      }
      if (!requestedUser.hasMentor) {
        return res.status(400).json(USER_HAS_NO_MENTOR(requestedUser.manageUserViewModel().name));
      }

      return Promise.all([templates.getById(requestedUser.templateId), skills.getAll(), evaluations.getLatestByUserId(requestedUser.id)])
        .then(([template, allSkills, latestEvaluation]) => {
          const userEvaluation = newEvaluation(template, requestedUser, allSkills);
          const mergedEvaluation = userEvaluation.mergePreviousEvaluation(latestEvaluation);
          return evaluations.addEvaluation(mergedEvaluation);
        })
        .then((newEval: Evaluation) => {
          sendMail(newEval.newEvaluationEmail());
          res.status(201).json(newEval.adminEvaluationViewModel());
        })
        .catch(next);
    },
  },
});

export default createHandler(handlerFunctions);
