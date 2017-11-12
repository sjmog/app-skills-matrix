import * as express from 'express';

import users from './api/users';
import matrices from './api/matrices';
import evaluations from './api/evaluations';
import actions from './api/actions';
import tasks from './api/tasks';
import clientApp from './clientApp';
import auth from './github';

const apiRoutes = [
  users,
  matrices,
  evaluations,
  actions,
  tasks,
];

const apiRouter = apiRoutes.reduce((app, route) => route(app), express.Router());

export default basePath => app =>
  app.use(basePath, apiRouter)
  && auth(app)
  && clientApp(app);
