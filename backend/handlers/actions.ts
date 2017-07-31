import { Response, Request, NextFunction } from 'express';
import * as Promise from 'bluebird';

import { User } from '../models/users/user';

import createHandler from './createHandler';

import actions from '../models/actions/index';
import users from '../models/users/index';
import { ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS } from './errors';

const handlerFunctions = Object.freeze({
  actions: {
    find: (req: Request, res: Response, next: NextFunction) => {
      const { evaluationId, type } = req.query;
      const { userId } = req.params;
      const { user }: { user: User } = res.locals;

      if (user.id === userId) {
        return Promise.try(() => actions.find(userId, evaluationId, type))
          .then(a => res.status(200).json(a.map(action => action.viewModel())))
          .catch(next);
      }

      Promise.try(() => users.getUserById(userId))
        .then(({ mentorId }) =>
          (user.id === mentorId
            ? Promise.try(() => actions.find(userId, evaluationId, type))
              .then(a => res.status(200).json(a.map(action => action.viewModel())))
              .catch(next)
            : res.status(403).json(ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS())));
    },
  },
});

export default createHandler(handlerFunctions);
