const request = require('supertest');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulate, skills, users } = require('./helpers/prepopulate');
const { sign, cookieName } = require('../backend/models/auth');

const prefix = '/skillz';

let adminToken, normalUserToken;
let normalUserId;

beforeEach(() =>
  prepopulate()
    .then(() =>
      Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
        .then(([adminUser, normalUser]) => {
          adminToken = sign({ email: adminUser.email, id: adminUser._id });
          normalUserToken = sign({ email: normalUser.email, id: normalUser._id });
          normalUserId = normalUser._id;
        })));

describe('POST /users', () => {
  it('should let admin create users', () =>
    request(app)
      .post(prefix + '/users')
      .send({ email: 'newuser@user.com', name: 'new name', action: 'create' })
      .set('Cookie', `${cookieName}=${adminToken}`)
      .expect(201)
      .then((res) => users.findOne({ email: res.body.email }))
      .then((newUser) => {
        expect(newUser.email).to.equal('newuser@user.com');
        expect(newUser.name).to.equal('new name');
      }));

  [
    () => ({
      desc: 'not authorized',
      token: normalUserToken,
      body: { email: 'newuser@user.com', name: 'new name', action: 'create' },
      expect: 403,
    }),
    () => ({
      desc: 'conflict',
      token: adminToken,
      body: { email: 'user@magic.com', name: 'new name', action: 'create' },
      expect: 409,
    }),
    () => ({
      desc: 'bad action',
      token: adminToken,
      body: { email: 'user@magic.com', name: 'new name', action: 'foo' },
      expect: 400,
    })
  ].forEach((test) =>
    it(`should handle error cases '${test().desc}'`, () =>
      request(app)
        .post(prefix + '/users')
        .send(test().body)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)));


});
describe('POST /users/:userId', () => {
  it('should let admin select a mentor', () =>
    request(app)
      .post(prefix + '/users/')
      .send({ email: 'newuser@user.com', name: 'new name', action: 'create' })
      .set('Cookie', `${cookieName}=${adminToken}`)
      .expect(201)
      .then((res) => users.findOne({ email: res.body.email }))
      .then((newUser) => {
        expect(newUser.email).to.equal('newuser@user.com');
        expect(newUser.name).to.equal('new name');
      }));

  [
    () => ({
      desc: 'not authorized',
      token: normalUserToken,
      body: { email: 'newuser@user.com', name: 'new name', action: 'create' },
      expect: 403,
    }),
    () => ({
      desc: 'conflict',
      token: adminToken,
      body: { email: 'user@magic.com', name: 'new name', action: 'create' },
      expect: 409,
    }),
    () => ({
      desc: 'bad action',
      token: adminToken,
      body: { email: 'user@magic.com', name: 'new name', action: 'foo' },
      expect: 400,
    })
  ].forEach((test) =>
    it(`should handle error cases '${test().desc}'`, () =>
      request(app)
        .post(prefix + '/users')
        .send(test().body)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)));


});
