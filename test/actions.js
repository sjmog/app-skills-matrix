const request = require('supertest');
const Promise = require('bluebird');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulateUsers, users, clearDb, insertAction, assignMentor } = require('./helpers');
const { sign, cookieName } = require('../backend/models/auth');
const actions = require('./fixtures/actions');

const prefix = '/skillz';

let normalUserOneToken;
let normalUserTwoToken;
let normalUserOneId;
let normalUserTwoId;

describe('actions', () => {
  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() =>
        Promise.all([
          users.findOne({ email: 'user@magic.com' }),
          users.findOne({ email: 'user@dragon-riders.com' }),
        ])
          .then(([normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ username: normalUserOne.username, id: normalUserOne._id });
            normalUserTwoToken = sign({ username: normalUserTwo.username, id: normalUserTwo._id });
            normalUserOneId = normalUserOne._id.toString();
            normalUserTwoId = normalUserTwo._id.toString();
          })));

  describe('GET /users/:userId/actions', () => {
    it('should return a list of all the user`s actions', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200))
        .then(({ body }) => {
          // @charlie - once you know what the viewmodel should look like, update this test
          expect(body.length).to.equal(actions.length);
        }));

    it('allows a mentor to view the actions of their mentee', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body.length).to.equal(actions.length);
        }));

    it('only allows a user and their mentor to view actions', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('should filter based on evaluation Id', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions?evaluationId=eval_1`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body.length).to.equal(1);
        }));

    it('should filter based on type', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions?type=OBJECTIVE`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body.length).to.equal(1);
        }));
  });
});

