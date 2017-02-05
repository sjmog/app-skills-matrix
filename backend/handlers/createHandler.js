const R = require('ramda');

const defaultHandler = {
  get: function (target, name) {
    return target.hasOwnProperty(name) ?
      target[name] :
      (req, res, next) => res.status(400).send({ message: `Requested action '${req.body.action}' does not exist` });
  }
};

module.exports = (handlerFunctions) => R.map((handler) => new Proxy(handler, defaultHandler), handlerFunctions);
