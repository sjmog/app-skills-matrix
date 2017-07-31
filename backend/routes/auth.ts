import * as authom from 'authom';
import { Application } from 'express';

import auth from '../models/auth';
import users from '../models/users/index';
import { User } from '../models/users/user';

authom.createServer({
  service: 'github',
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET,
  scope: ['user:email'],
});

authom.on('auth', (req, res, { data }) =>
  users.getUserByUsername(data.login)
    .then((user: User) => {
      const githubData = { email: data.email, name: data.name, avatarUrl: data.avatar_url, username: data.login };
      const userFn: Promise<User> = !user ? users.addUser(githubData) : Promise.resolve(user);
      userFn.then(u => auth.sign(u.signingData()))
        .then((token) => {
          res.cookie(auth.cookieName, token);
          res.redirect('/');
        })
        .catch(({ message, stack }) =>
          res.status(500).json({ message, stack }));
    }));

authom.on('error', (req, res, data) => res.status(500).json(data));

export default (app: Application) => app.get('/auth/:service', authom.app) && app;
