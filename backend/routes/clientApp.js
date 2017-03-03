const { Router } = require('express');
const serialize = require('serialize-javascript');
const { adminClientState, clientState } = require('../models/initialClientState');
const { ensureAdmin } = require('../middlewares/auth');

module.exports = app => {
  app.get('/admin', ensureAdmin, (req, res, next) => {
    adminClientState()
      .then((clientState) => res.render('index', {
        appState: serialize(clientState, { isJSON: true }),
        context: 'admin',
      }))
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    clientState(res.locals.user)
      .then((clientState) => res.render('index', {
        appState: serialize(clientState, { isJSON: true }),
        context: 'user',
      }))
      .catch(next);
  });

  return app;
};
