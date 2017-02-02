const express = require('express');

const users = require('./users');
const root = require('./root');
const auth = require('./auth');

const routes = [
  users,
  root,
];

const router = routes.reduce((app, route) => route(app), express.Router());

module.exports = basePath => app =>
  app.use(basePath, router)
  && auth(app);
