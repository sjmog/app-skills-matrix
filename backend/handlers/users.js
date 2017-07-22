import Promise from 'bluebird';

import users from '../models/users';
import matrices from '../models/matrices';
import { newEvaluation } from '../models/evaluations/evaluation';
import evaluations from '../models/evaluations';
import createHandler from './createHandler';
import sendMail from '../services/email';
import { USER_EXISTS, MUST_BE_ADMIN, USER_NOT_FOUND, TEMPLATE_NOT_FOUND, USER_HAS_NO_TEMPLATE, USER_HAS_NO_MENTOR } from './errors';

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
      const { user } = res.locals;
      if (!user || !user.isAdmin()) {
        return res.status(403).json(MUST_BE_ADMIN());
      }
      Promise.try(() => users.getUserById(req.params.userId))
        .then((userToUpdate) => {
          if (!userToUpdate) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          const changes = userToUpdate.setMentor(req.body.mentorId);
          if (changes.error) {
            return res.status(400).json(changes);
          }
          return users.updateUser(userToUpdate, changes)
            .then(updatedUser => res.status(200).json(updatedUser.manageUserViewModel()));
        })
        .catch(next);
    },
    selectTemplate: (req, res, next) => {
      const { user } = res.locals;
      if (!user || !user.isAdmin()) {
        return res.status(403).json(MUST_BE_ADMIN());
      }
      Promise.all([users.getUserById(req.params.userId), templates.getById(req.body.templateId)])
        .then(([userToUpdate, template]) => {
          if (!userToUpdate) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          if (!template) {
            return res.status(400).json(TEMPLATE_NOT_FOUND());
          }

          const changes = userToUpdate.setTemplate(req.body.templateId);
          return users.updateUser(userToUpdate, changes)
            .then(updatedUser => res.status(200).json(updatedUser.manageUserViewModel()));
        })
        .catch(next);
    },
  },
  evaluations: {
    create: (req, res, next) => {
      Promise.try(() => users.getUserById(req.params.userId))
        .then((user) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          if (!user.hasTemplate) {
            return res.status(400).json(USER_HAS_NO_TEMPLATE(user.manageUserViewModel().name));
          }
          if (!user.hasMentor) {
            return res.status(400).json(USER_HAS_NO_MENTOR(user.manageUserViewModel().name));
          }

          return Promise.all([templates.getById(user.templateId), skills.getAll(), evaluations.getLatestByUserId(user.id)])
            .then(([template, allSkills, latestEvaluation]) => {
              const userEvaluation = newEvaluation(template, user, allSkills);
              const mergedEvaluation = userEvaluation.mergePreviousEvaluation(latestEvaluation);
              return evaluations.addEvaluation(mergedEvaluation);
            })
            .then((newEval) => {
              sendMail(newEval.newEvaluationEmail);
              res.status(201).json(newEval.viewModel);
            });
        })
        .catch(next);
    },
  },
});

export default createHandler(handlerFunctions);
