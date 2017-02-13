const Promise = require('bluebird');

const users = require('../models/users');
const createHandler = require('./createHandler');
const { USER_EXISTS, MUST_BE_ADMIN, USER_NOT_FOUND } = require('./errors');

const handlerFunctions = Object.freeze({
  users: {
    create: function (req, res, next) {
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
    selectMentor: function (req, res, next) {
      const { user } = res.locals;
      if (!user || !user.isAdmin) {
        return res.status(403).json(MUST_BE_ADMIN());
      }
      users.getUserById(req.params.userId)
        .then((user) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          return users.updateUser(user, user.setMentor(req.body.mentorId))
            .then((updatedUser) => res.status(200).json(updatedUser.viewModel));
        })
    }
  }

});

module.exports = createHandler(handlerFunctions);
