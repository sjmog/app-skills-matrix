const { Router } = require('express');

const skills = require('./skills');
const users = require('./users');
const auth = require('./auth');

const routes = [
  skills, 
  users
];
const router = routes.reduce((app, route) => route(app), Router());

module.exports = basePath => app => 
  app.use(basePath, router)
  && auth(app);