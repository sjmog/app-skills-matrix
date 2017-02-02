const { Router } = require('express');
const serialize = require('serialize-javascript');

module.exports = (app) => {
  const router = Router();
  let clientState = [
    { id: 0, firstName: 'David', lastName: 'Morgantini', email: 'david1@tes.com' },
    { id: 1, firstName: 'Charlie', lastName: 'Harris', email: 'charlie.harris@tesglobal.com' },
    { id: 2, firstName: 'Federico', lastName: 'Rampazzo', email: 'federico.rampazzo@tesglobal.com' },
  ];
  router.get('/', (req, res, next) => res.render('index', {
    appState: serialize(clientState, { isJSON: true }),
  }));
  app.use('/', router);
  return app
};
