const authom = require('authom');

const auth = require('../models/auth');
const users = require('../models/users');

authom.createServer({
  service: 'github',
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET,
  scope: ['user:email']
});

authom.on('auth', (req, res, { data }) =>
  users.getUserByUsername(data.login)
    .then((user) => {
      const githubData = { email: data.email, name: data.name, avatarUrl: data.avatar_url, username: data.login };
      const userFn = !user ? users.addUser(githubData) : Promise.resolve(user);
      userFn.then((user) => auth.sign(user.signingData))
        .then((token) => {
          res.cookie(auth.cookieName, token);
          res.redirect('/')
        })
        .catch(({ message, stack }) =>
          res.status(500).json({ message, stack }));
    }));

authom.on('error', (req, res, data) => res.status(500).json(data));

module.exports = app => app.get('/auth/:service', authom.app) && app;
