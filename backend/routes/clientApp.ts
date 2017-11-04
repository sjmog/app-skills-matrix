import * as Promise from 'bluebird';
import * as serialize from 'serialize-javascript';
import { adminClientState, clientState } from '../models/initialClientState';
import { ensureAdmin } from '../middlewares/auth';
const noCacheHeaders = ['Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'];

export default (app) => {
  app.get('/admin*', ensureAdmin, (req, res, next) => {
    Promise.try(() => adminClientState(res.locals.user))
      .then((fetchedClientState) => {
        res.set(...noCacheHeaders);
        res.render('index', {
            appState: serialize(fetchedClientState, { isJSON: true }),
            context: 'admin',
          });
      })
      .catch(next);
  });

  app.get('*', (req, res, next) => {
    Promise.try(() => clientState(res.locals.user))
      .then((fetchedClientState) => {
        res.set(...noCacheHeaders);
        res.render('index', {
          appState: serialize(fetchedClientState, { isJSON: true }),
          context: 'user',
        });
      })
      .catch(next);
  });

  return app;
};
