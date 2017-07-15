const Promise = require('bluebird');
const serialize = require('serialize-javascript');
const { adminClientState, clientState } = require('../models/initialClientState');
const { ensureAdmin } = require('../middlewares/auth');

module.exports = (app) => {
  app.get('/admin*', ensureAdmin, (req, res, next) => {
    Promise.try(() => adminClientState())
      .then(fetchedClientState => res.render('index', {
        appState: serialize(fetchedClientState, { isJSON: true }),
        context: 'admin',
      }))
      .catch(next);
  });

  app.get('*', (req, res, next) => {
    Promise.try(() => clientState(res.locals.user))
      .then(fetchedClientState => res.render('index', {
        appState: serialize(fetchedClientState, { isJSON: true }),
        context: 'user',
      }))
      .catch(next);
  });

  return app;
};
