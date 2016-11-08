const authom = require('authom')

const auth = require('../models/auth')

authom.createServer({ 
  service: 'github',
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET,
  scope: ['user:email']
})
authom.on('auth', (req, res, data) => 
  auth.sign(data.data.email)
    .then(token => {
      res.cookie(auth.cookieName, token)
      res.redirect('/')
    })
    .catch(({ message, stack }) => 
      res.status(500).json({ message, stack })))
authom.on('error', (req, res, data) => res.status(500).json(data))

module.exports = app =>
  app.get('/auth/:service', authom.app)
  && app