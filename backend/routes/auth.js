const authom = require('authom');

const auth = require('../models/auth');
const users = require('../models/users');

authom.createServer({
  service: 'github',
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET,
  scope: ['user:email']
});

authom.on('auth', (req, res, data) =>
  users.addUser({ email: data.data.email, name: data.data.name, avatarUrl: data.data.avatar_url })
    .then((user) => auth.sign(user.signingData))
    .then(token => {
      res.cookie(auth.cookieName, token);
      res.redirect('/')
    })
    .catch(({ message, stack }) =>
      res.status(500).json({ message, stack })));
authom.on('error', (req, res, data) => res.status(500).json(data));

module.exports = app => app.get('/auth/:service', authom.app) && app;
