const Promise = require('bluebird');

const createHandler = require('./createHandler');

const actions = require('../models/actions');
const { USER_CAN_ONLY_SEE_THEIR_OWN_ACTIONS } = require('./errors');

const handlerFunctions = Object.freeze({
  actions: {
    find: (req, res, next) => {
      const { evaluationId, type } = req.query;
      const { userId } = req.params;
      const { user } = res.locals;

      if (user.id !== userId) {
        return res.status(403).json(USER_CAN_ONLY_SEE_THEIR_OWN_ACTIONS())
      }

      Promise.try(() => actions.find(userId, evaluationId, type))
        .then((actions) => {
          return res.status(200).json(actions.map((action) => action.viewModel))
        })
        .catch(next);
    },
  }
});

module.exports = createHandler(handlerFunctions);
