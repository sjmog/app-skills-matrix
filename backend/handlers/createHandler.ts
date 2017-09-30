/* eslint-disable no-prototype-builtins */
import * as R from 'ramda';

import { User } from '../models/users/user';
import { Evaluation } from '../models/evaluations/evaluation';
import { Permissions } from '../models/users/permissions';

export type Locals = {
  evaluationUser?: User,
  requestedEvaluation?: Evaluation,
  user?: User,
  permissions?: Permissions,
};

const defaultHandler = {
  get(target, name) {
    return target.hasOwnProperty(name) ?
      target[name] :
      (req, res) => res.status(400).json({ message: `Requested action '${req.body.action}' does not exist` });
  },
};

export default handlerFunctions => R.map(handler => new Proxy(handler, defaultHandler), handlerFunctions);
