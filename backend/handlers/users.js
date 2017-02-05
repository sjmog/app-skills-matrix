const users = require('../models/users');
const createHandler = require('./createHandler');

const handlerFunctions = Object.freeze({
  post: {
    create: function (req, res, next) {
      users.getUser(req.body.email)
        .then((user) => {
          if (user) {
            return res.status(409).send({ message: `User with email '${req.body.email}' already exists`});
          }
          return users.addUser(req.body)
            .then((user) => res.status(201).send(user.viewModel))

        })
        .catch((err) => next(err));
    }
  },
});

module.exports = createHandler(handlerFunctions);
