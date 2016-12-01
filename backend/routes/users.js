const { Router } = require('express');

const { ensureOwner, ensureAdmin } = require('../middlewares/auth');
const crud = require('../middlewares/crud');
const users = require('../models/users');

const listAdminPublicKeys = (req, res, next) => 
  users.list({ isAdmin: true, publicKey: { $exists: true } })
    .then(users => users.map(user => user.publicKey))
    .then(data => res.status(200).json(data))
    .catch(({ message, stack }) => res.status(500).json({ message, stack }));

module.exports = (app) => {
  const router = Router();
  router.get('/admins/public-keys', listAdminPublicKeys);
  router.get('/', ensureAdmin, crud(users).list);
  router.get('/:id', ensureOwner, crud(users).read);
  router.put('/:id', ensureOwner, crud(users).update);
  app.use('/users', router);
  return app
};