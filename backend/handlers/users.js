const Promise = require('bluebird');

const users = require('../models/users');
const { templates, skills } = require('../models/matrices');
const { newEvaluation } = require('../models/evaluations/evaluation');
const evaluations = require('../models/evaluations');
const createHandler = require('./createHandler');
const { sendMail } = require('../services/email');
const { USER_EXISTS, MUST_BE_ADMIN, USER_NOT_FOUND, TEMPLATE_NOT_FOUND, USER_HAS_NO_TEMPLATE, USER_HAS_NO_MENTOR } = require('./errors');

const handlerFunctions = Object.freeze({
  users: {
    create: (req, res, next) => {
      Promise.try(() => users.getUserByEmail(req.body.email))
        .then((user) => {
          if (user) {
            return res.status(409).json(USER_EXISTS(req.body.email));
          }
          return users.addUser(req.body)
            .then((user) => res.status(201).send(user.manageUserViewModel))

        })
        .catch(next);
    }
  },
  user: {
    selectMentor: (req, res, next) => {
      const { user } = res.locals;
      if (!user || !user.isAdmin) {
        return res.status(403).json(MUST_BE_ADMIN());
      }
      Promise.try(() => users.getUserById(req.params.userId))
        .then((user) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          const changes = user.setMentor(req.body.mentorId);
          if (changes.error) {
            return res.status(400).json(changes);
          }
          return users.updateUser(user, changes)
            .then((updatedUser) => res.status(200).json(updatedUser.manageUserViewModel));
        })
        .catch(next);
    },
    selectTemplate: (req, res, next) => {
      const { user } = res.locals;
      if (!user || !user.isAdmin) {
        return res.status(403).json(MUST_BE_ADMIN());
      }
      Promise.all([users.getUserById(req.params.userId), templates.getById(req.body.templateId)])
        .then(([user, template]) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          if (!template) {
            return res.status(400).json(TEMPLATE_NOT_FOUND());
          }

          const changes = user.setTemplate(req.body.templateId);
          return users.updateUser(user, changes)
            .then((updatedUser) => res.status(200).json(updatedUser.manageUserViewModel));
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
            return res.status(400).json(USER_HAS_NO_TEMPLATE(user.manageUserViewModel.name));
          }
          if (!user.hasMentor) {
            return res.status(400).json(USER_HAS_NO_MENTOR(user.manageUserViewModel.name));
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
    }
  },
});

module.exports = createHandler(handlerFunctions);
