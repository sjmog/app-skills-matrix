import { Response, Request, NextFunction } from 'express';

import { Locals } from '../middlewares/auth';
import tasks from '../models/tasks';

const handlerFunctions = Object.freeze({
  find: (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { permissions } = <Locals>res.locals;

   permissions.viewTasks()
     .then(() => tasks.get(userId))
     .then((retrievedTasks) => {
       res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
       res.status(200).json(retrievedTasks.taskListViewModel());
     })
     .catch(err =>
       (err.status && err.data) ? res.status(err.status).json(err.data) : next(err));
  },
});

export default handlerFunctions;
