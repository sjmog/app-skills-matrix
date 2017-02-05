const { Router } = require('express');
const serialize = require('serialize-javascript');

let clientState = {
  manageUsers: {
    users: [
      { id: 'f5ssj4wdsu4ttw17cln16t9hp6j5e4infio1obuxsc2vbncph', name: 'David Morgantini', email: 'david@tes.com' },
      { id: 'f5ssj4wdsu4ttw27cln16t9hp6j5e4infio1obuxsc2vbncph', name: 'Charlie Harris', email: 'charlie.harris@tesglobal.com' },
      { id: 'f5ssj4wdsu4ttw37cln16t9hp6j5e4infio1obuxsc2vbncph', name: 'Federico Rampazzo', email: 'federico.rampazzo@tesglobal.com' },
    ]
  }
};

module.exports = app => app.get('/', (req, res, next) => res.render('index', {
  appState: serialize(clientState, { isJSON: true }),
})) && app;
