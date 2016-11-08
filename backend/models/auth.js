const jwt = require('jsonwebtoken')

const database = require('../database')
const users = database.collection('users')
const secret = process.env.JWT_SECRET
const unauthorizedPromise = () => Promise.reject(new Error('You don\'t have permissions to access'))

module.exports = {
  sign: email => 
    users.update({ email }, { $set: { email } }, { upsert: true })
      .then(() => users.findOne({ email }))
      .then(user => user || {})
      .then(({ _id: id, isAdmin }) => 
        jwt.sign({ id, email, isAdmin }, secret)),
  verify: token => new Promise((resolve, reject) => 
    jwt.verify(token, secret, (err, data) => 
      err ? reject(err) : resolve(data))),
  ensureOwner: (id, user) => user && user.isAdmin || user.id === id 
    ? Promise.resolve() : unauthorizedPromise(),
  ensureAdmin: (user) => user && user.isAdmin 
    ? Promise.resolve() : unauthorizedPromise(),
  cookieName: 'skillsmatrix-auth'
}