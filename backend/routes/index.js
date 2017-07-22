import express from 'express';

import users from './users';
import matrices from './matrices';
import evaluations from './evaluations';
import actions from './actions';
import clientApp from './clientApp';
import auth from './auth';

const apiRoutes = [
  users,
  matrices,
  evaluations,
  actions,
];

const apiRouter = apiRoutes.reduce((app, route) => route(app), express.Router());

export default basePath => app =>
  app.use(basePath, apiRouter)
  && auth(app)
  && clientApp(app);
