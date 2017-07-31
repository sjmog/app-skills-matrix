/* eslint-disable no-prototype-builtins */
import * as R from 'ramda';

const defaultHandler = {
  get(target, name) {
    return target.hasOwnProperty(name) ?
      target[name] :
      (req, res) => res.status(400).json({ message: `Requested action '${req.body.action}' does not exist` });
  },
};

export default handlerFunctions => R.map(handler => new Proxy(handler, defaultHandler), handlerFunctions);
