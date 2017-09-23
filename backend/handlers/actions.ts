import { Response, Request, NextFunction } from 'express';
import * as Promise from 'bluebird';

import createHandler from './createHandler';

import actions from '../models/actions/index';
import { ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS } from './errors';

const handlerFunctions = Object.freeze({
  actions: {
    find: (req: Request, res: Response, next: NextFunction) => {
      const { evaluationId, type } = req.query;
      const { userId } = req.params;

      if (res.locals.permissions.viewActions) {
        return Promise.try(() => actions.find(userId, evaluationId, type))
          .then(a => res.status(200).json(a.map(action => action.viewModel())))
          .catch(next);
      }

      return res.status(403).json(ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS());
    },
  },
});

export default createHandler(handlerFunctions);
