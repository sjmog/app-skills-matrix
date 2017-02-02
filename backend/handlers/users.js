const users = require('../models/users');

module.exports = Object.freeze({
  post: {
    create: function (req, res, next) {
      users.add(req.body)
        .then((user) => res.status(201).send(user.viewModel))
        .catch((err) => next(err));
    }
  },
  get: function (req, res) {
    return res.status(200).send([
      { id: 0, firstName: 'David', lastName: 'Morgantini', email: 'david@tes.com' },
      { id: 1, firstName: 'Charlie', lastName: 'Harris', email: 'charlie.harris@tesglobal.com' },
      { id: 2, firstName: 'Federico', lastName: 'Rampazzo', email: 'federico.rampazzo@tesglobal.com' },
    ]);
  }
});

