/* eslint-disable no-prototype-builtins */
const R = require('ramda');

const defaultHandler = {
  get(target, name) {
    return target.hasOwnProperty(name) ?
      target[name] :
      (req, res) => res.status(400).json({ message: `Requested action '${req.body.action}' does not exist` });
  },
};

module.exports = handlerFunctions => R.map(handler => new Proxy(handler, defaultHandler), handlerFunctions);
