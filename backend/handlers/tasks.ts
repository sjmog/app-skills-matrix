import { Response, Request, NextFunction } from 'express';

import createHandler, { Locals } from './createHandler';
import tasks from '../models/tasks';

const handlerFunctions = Object.freeze({
  find: (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { permissions } = <Locals>res.locals;

   permissions.viewTasks()
     .then(() => tasks.get(userId))
     .then(retrievedTasks => res.status(200).json(retrievedTasks.taskListViewModel()))
     .catch(err =>
       (err.status && err.data) ? res.status(err.status).json(err.data) : next(err));
  },
});

export default createHandler(handlerFunctions);
