const { Router } = require('express');
const serialize = require('serialize-javascript');
const initialClientState = require('../models/initialClientState');

module.exports = app => app.get('/', (req, res, next) => {
  initialClientState(res.locals.user)
    .then((clientState) => {
      res.render('index', {
        appState: serialize(clientState, { isJSON: true }),
      });
    }).catch(next);
}) && app;
