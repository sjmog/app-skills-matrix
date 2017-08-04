import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

import debug from 'debug';

import { populateUser } from './auth';

const debugConfig = debug('skillz:http');

const before = [
  express.static('frontend/dist'),
  debugConfig.enabled ? morgan('dev') : (req, res, next) => next(),
  bodyParser.json(),
  cookieParser(),
  populateUser,
];

const after = [
  (req, res) => res.status(404).end(),
];

const use = app => middleware => app.use(middleware);

export default [
  app => before.forEach(use(app)) || app,
  app => after.forEach(use(app)) || app,
];