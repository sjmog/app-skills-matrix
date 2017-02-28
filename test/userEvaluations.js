const request = require('supertest');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulate, users, evaluations } = require('./helpers/prepopulate');
const { sign, cookieName } = require('../backend/models/auth');

const prefix = '/skillz';

let adminToken;
let adminUserId, normalUserId;

beforeEach(() =>
  prepopulate()
    .then(() =>
      Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
        .then(([adminUser, normalUser]) => {
          adminToken = sign({ email: adminUser.email, id: adminUser._id });
          normalUserId = normalUser._id;
          adminUserId = adminUser._id;
        })));

describe('POST /users/:userId/evaluations', () => {
  it('should let admin create an evaluation for a user', () =>
    request(app)
      .post(`${prefix}/users/${normalUserId}/evaluations`)
      .send({ action: 'create' })
      .set('Cookie', `${cookieName}=${adminToken}`)
      .expect(201)
      .then(() => evaluations.find({}).toArray())
      .then((evaluationList) => {
        expect(evaluationList.length).to.equal(1);
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
    it.skip(`should handle error cases '${test().desc}'`, () =>
      request(app)
        .post(`${prefix}/users`)
        .send(test().body)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)));

});
