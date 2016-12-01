const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const debug = require('debug')('skillz:http');

const { populateUser } = require('./auth');

const before = [
  express.static('frontend/dist'),
  debug.enabled ? morgan('dev') : (req, res, next) => next(),
  bodyParser.json(),
  cookieParser(),
  populateUser
];
const after = [
  (req, res, next) => res.status(404).end()
];

const use = app => middleware => app.use(middleware);

module.exports = [
  app => before.forEach(use(app)) || app,
  app => after.forEach(use(app)) || app
];
