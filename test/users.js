const test = before = require('tape')
const request = require('supertest')

const app = require('../backend')
const { prepopulate, skills, users } = require('./helpers/prepopulate')
const { sign, cookieName } = require('../backend/models/auth')

test.onFinish(() => process.exit(0))
const prefix = '/api/skillz'
const skillsData = require('./fixtures/skills')
const usersData = require('./fixtures/users')
const getEmail = a => a.email

before('Prepopulate database', assert => prepopulate().then(() => assert.end()))

test('Users can get their data', assert => {
  Promise.all([
    sign(usersData[1].email),
    users.findOne({ email: usersData[1].email })
  ]).then(([token, user]) => {
    request(app)
      .get(prefix + '/users/' + user._id)
      .set('Cookie', `${cookieName}=${token}`)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err
        assert.error(err, 'No error')
        assert.end()
      })
    })
})

test('Users can\'t access other users\' data', assert => {
  Promise.all([
    sign(usersData[1].email),
    users.findOne({ email: usersData[0].email })
  ]).then(([token, user]) => {
    request(app)
      .get(prefix + '/users/' + user._id)
      .set('Cookie', `${cookieName}=${token}`)
      .expect(403)
      .end(function(err, res) {
        if (err) throw err
        assert.error(err, 'No error')
        assert.end()
      })
    })
})

test('Admins can access other users\' data', assert => {
  Promise.all([
    sign(usersData[0].email),
    users.findOne({ email: usersData[1].email })
  ]).then(([token, user]) => {
    request(app)
      .get(prefix + '/users/' + user._id)
      .set('Cookie', `${cookieName}=${token}`)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err
        assert.error(err, 'No error')
        assert.end()
      })
    })
})

test('Admins can list users', assert => {
  sign(usersData[0].email)
    .then(token => {
      request(app)
        .get(prefix + '/users')
        .set('Cookie', `${cookieName}=${token}`)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err
          assert.error(err, 'No error')
          assert.deepEqual(res.body.map(getEmail), usersData.map(getEmail))
          assert.end()
        })
    })
})