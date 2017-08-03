const Promise = require('bluebird');

const createHandler = require('./createHandler');

const actions = require('../models/actions');
const { getUserById } = require('../models/users');
const { ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS } = require('./errors');

const handlerFunctions = Object.freeze({
  actions: {
    find: (req, res, next) => {
      const { evaluationId, type } = req.query;
      const { userId } = req.params;
      const { user } = res.locals;

      if (user.id === userId) {
        return Promise.try(() => actions.find(userId, evaluationId, type))
          .then(a => res.status(200).json(a.map(action => action.viewModel)))
          .catch(next);
      }

      return getUserById(userId)
        .then(({ mentorId }) =>
          (user.id === mentorId
            ? Promise.try(() => actions.find(userId, evaluationId, type))
              .then(a => res.status(200).json(a.map(action => action.viewModel)))
              .catch(next)
            : res.status(403).json(ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS())));
    },
  },
});

module.exports = createHandler(handlerFunctions);
