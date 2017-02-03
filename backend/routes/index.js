const express = require('express');

const users = require('./users');
const clientApp = require('./clientApp');
const auth = require('./auth');

const routes = [
  users,
];

const router = routes.reduce((app, route) => route(app), express.Router());

module.exports = basePath => app =>
  app.use(basePath, router)
  && clientApp(app)
  && auth(app);
