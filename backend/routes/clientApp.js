import Promise from 'bluebird';
import serialize from 'serialize-javascript';
import { adminClientState, clientState } from '../models/initialClientState';
import { ensureAdmin } from '../middlewares/auth';

export default (app) => {
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
