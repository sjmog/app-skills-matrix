const test = before = require('tape')
const request = require('supertest')

const app = require('../backend')
const { prepopulate, skills } = require('./helpers/prepopulate')
const { sign, cookieName } = require('../backend/models/auth')

test.onFinish(() => process.exit(0))
const prefix = '/api/skillz'
const skillsData = require('./fixtures/skills')
const usersData = require('./fixtures/users')
const getName = a => a.name

before('Prepopulate database', assert => prepopulate().then(() => assert.end()))

test('Users can list skills', assert => {
  request(app)
    .get(prefix + '/skills')
    .expect(200)
    .end(function(err, res) {
      if (err) throw err
      assert.error(err, 'No error')
      assert.deepEqual(res.body.map(getName), skillsData.map(getName))
      assert.end()
    })
})

test('Users cannot write skills', assert => {
  request(app)
    .post(prefix + '/skills')
    .send({ 
      name: 'Conjuration', 
      category: 'Magic', 
      description: 'The School of Conjuration governs raising the dead or summoning creatures from the Realms of Oblivion.' })
    .expect(403)
    .end(function(err, res) {
      if (err) throw err
      assert.error(err, 'No error')
      assert.end()
    })
})

test('Users can read a skill', assert => {
  Promise.all([
    sign(usersData[1].email),
    skills.findOne({})
  ]).then(([token, skill]) => {
    request(app)
      .get(prefix + '/skills/' + skill._id)
      .set('Cookie', `${cookieName}=${token}`)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err
        assert.error(err, 'No error')
        assert.end()
      })
    })
})

test('Admins can create skills', assert => {
  sign(usersData[0].email).then((token) => {
    request(app)
      .post(prefix + '/skills')
      .set('Cookie', `${cookieName}=${token}`)
      .send({ 
        name: 'Shout', 
        category: 'Magic'
      })
      .expect(201)
      .end((err, res) => {
        if (err) throw err
        assert.error(err, 'No error')
        assert.equal(res.body.insertedCount, 1)
        assert.end()
      }) 
    })
})

test('Admins can update skills', assert => {
  Promise.all([
    sign(usersData[0].email),
    skills.findOne({})
  ]).then(([token, skill]) => {
    request(app)
      .put(prefix + '/skills/' + skill._id)
      .set('Cookie', `${cookieName}=${token}`)
      .send({ 
        name: 'Cry'
      })
      .expect(204)
      .end(function(err, res) {
        if (err) throw err
        assert.error(err, 'No error')
        assert.end()
      })
    })
})

test('Admins users can delete skills', assert => {
  Promise.all([
    sign(usersData[0].email),
    skills.findOne({})
  ]).then(([token, skill]) => {
    request(app)
      .delete(prefix + '/skills/' + skill._id)
      .set('Cookie', `${cookieName}=${token}`)
      .expect(204)
      .end(function(err, res) {
        if (err) throw err
        assert.error(err, 'No error')
        assert.end()
      }) 
    })
})
