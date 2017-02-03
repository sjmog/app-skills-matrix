const { Router } = require('express');
const serialize = require('serialize-javascript');

module.exports = (app) => {
  const router = Router();
  let clientState = {
    users: [
      { id: 'f5ssj4wdsu4ttw17cln16t9hp6j5e4infio1obuxsc2vbncph', firstName: 'David', lastName: 'Morgantini', email: 'david@tes.com' },
      { id: 'f5ssj4wdsu4ttw27cln16t9hp6j5e4infio1obuxsc2vbncph', firstName: 'Charlie', lastName: 'Harris', email: 'charlie.harris@tesglobal.com' },
      { id: 'f5ssj4wdsu4ttw37cln16t9hp6j5e4infio1obuxsc2vbncph', firstName: 'Federico', lastName: 'Rampazzo', email: 'federico.rampazzo@tesglobal.com' },
    ]
  };
  router.get('/', (req, res, next) => res.render('index', {
    appState: serialize(clientState, { isJSON: true }),
  }));
  app.use('/', router);
  return app
};
