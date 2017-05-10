const express = require('express');

const users = require('./users');
const matrices = require('./matrices');
const evaluations = require('./evaluations');
const actions = require('./actions');
const clientApp = require('./clientApp');
const auth = require('./auth');

const apiRoutes = [
  users,
  matrices,
  evaluations,
  actions,
];

const apiRouter = apiRoutes.reduce((app, route) => route(app), express.Router());

module.exports = basePath => app =>
  app.use(basePath, apiRouter)
  && auth(app)
  && clientApp(app);
