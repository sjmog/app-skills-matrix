const express = require('express');

const users = require('./users');
const matrices = require('./matrices');
const clientApp = require('./clientApp');
const auth = require('./auth');

const apiRoutes = [
  users,
  matrices,
];

const apiRouter = apiRoutes.reduce((app, route) => route(app), express.Router());

module.exports = basePath => app =>
  app.use(basePath, apiRouter)
  && clientApp(app)
  && auth(app);
