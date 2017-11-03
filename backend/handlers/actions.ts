import { Response, Request, NextFunction } from 'express';

import { Locals } from '../middlewares/auth';
import actions from '../models/actions/index';

const handlerFunctions = Object.freeze({
  actions: {
    find: (req: Request, res: Response, next: NextFunction) => {
      const { evaluationId, type } = req.query;
      const { userId } = req.params;
      const { permissions } = <Locals>res.locals;

      permissions.viewActions()
        .then(() => actions.find(userId, evaluationId, type))
        .then(a => res.status(200).json(a.map(action => action.viewModel())))
        .catch(next);
    },
  },
});

export default handlerFunctions;
