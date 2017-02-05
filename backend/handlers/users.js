const users = require('../models/users');
const createHandler = require('./createHandler');

const handlerFunctions =  Object.freeze({
  post: {
    create: function (req, res, next) {
      users.add(req.body)
        .then((user) => res.status(201).send(user.viewModel))
        .catch((err) => next(err));
    }
  },
});

module.exports = createHandler(handlerFunctions);
