import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

import debug from 'debug';

import { populateUser } from './auth';

const debugConfig = debug('skillz:http');

const logErrors = (err, req, res, next) => {
  // TODO: better error logging
  console.error(JSON.stringify(err.stack || err.data));
  next(err);
};

const handle404 = (req, res) => res.status(404).end();

const handleClientErrors = (err, req, res, next) => {
  if (req.xhr) {
    if (err.status && err.data) {
      return res.status(err.status).json(err.data);
    }
    return res.status(500).send({ message: 'Something failed!' });
  }

  next(err);
};

const before = [
  express.static('frontend/dist'),
  debugConfig.enabled ? morgan('dev') : (req, res, next) => next(),
  bodyParser.json(),
  cookieParser(),
  populateUser,
];

const after = [
  handle404,
  logErrors,
  handleClientErrors,
]; // TODO: handle html errors (shrug)

const use = app => middleware => app.use(middleware);

export default [
  app => before.forEach(use(app)) || app,
  app => after.forEach(use(app)) || app,
];
