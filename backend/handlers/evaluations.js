const Promise = require('bluebird');

const createHandler = require('./createHandler');
const { getEvaluationById } = require('../models/evaluations');
const { EVALUATION_NOT_FOUND } = require('./errors');

const handlerFunctions = Object.freeze({
  evaluation: {
    retrieve: (req, res, next) => {
      Promise.try(() => getEvaluationById(req.params.evaluationId))
        .then(evaluation =>
          evaluation
            ? res.status(200).json(evaluation.userEvaluationViewModel)
            : res.status(404).json(EVALUATION_NOT_FOUND()))
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
