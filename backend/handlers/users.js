const Promise = require('bluebird');

const users = require('../models/users');
const { templates } = require('../models/matrices');
const createHandler = require('./createHandler');
const { USER_EXISTS, MUST_BE_ADMIN, USER_NOT_FOUND, TEMPLATE_NOT_FOUND } = require('./errors');

const handlerFunctions = Object.freeze({
  users: {
    create: (req, res, next) => {
      Promise.try(() => users.getUserByEmail(req.body.email))
        .then((user) => {
          if (user) {
            return res.status(409).json(USER_EXISTS(req.body.email));
          }
          return users.addUser(req.body)
            .then((user) => res.status(201).send(user.viewModel))

        })
        .catch((err) => next(err));
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
            .then((updatedUser) => res.status(200).json(updatedUser.viewModel));
        })
        .catch((err) => next(err));
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
            .then((updatedUser) => res.status(200).json(updatedUser.viewModel));
        })
        .catch((err) => next(err));
    },
  },
  evaluations: {
    create: (req, res, next) => {

    }
  },
});

module.exports = createHandler(handlerFunctions);
