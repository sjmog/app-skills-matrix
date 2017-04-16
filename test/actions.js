const request = require('supertest');
const Promise = require('bluebird');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulateUsers, users, evaluations, clearDb, getAllActions, insertAction } = require('./helpers');
const { sign, cookieName } = require('../backend/models/auth');
const actions = require('./fixtures/actions');

const prefix = '/skillz';

let normalUserOneToken;
let normalUserOneId;

describe('actions', () => {

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() =>
        Promise.all([
          users.findOne({ email: 'user@magic.com' }),
        ])
          .then(([normalUserOne]) => {
            normalUserOneToken = sign({ email: normalUserOne.email, id: normalUserOne._id });
            normalUserOneId = normalUserOne._id.toString();
          })));

  describe('GET /users/:userId/actions', () => {
    it('should return a list of all the user`s actions', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          // @charlie - once you know what the viewmodel should look like, update this test
          expect(body.length).to.equal(actions.length);
        }));

    it('should filter based on evaluation Id', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions?evaluationId=eval_1`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          expect(body.length).to.equal(1);
        }));
    it('should filter based on type', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions?type=OBJECTIVE`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          expect(body.length).to.equal(1);
        }));
  });
});

