import * as request from 'supertest';
import * as Promise from 'bluebird';
import { expect } from 'chai';
import fixtureUsers from '../fixtures/users';

import app from '../../backend/app';
import helpers from '../helpers';
import auth from '../../backend/models/auth';
import actions from '../fixtures/actions';

const { sign, cookieName } = auth;
const { magic, dragonrider } = fixtureUsers;
const { prepopulateUsers, clearDb, insertAction, assignMentor } = helpers;
const prefix = '/skillz';

const normalUserOneToken = sign({ username: magic.username, id: magic._id.toString() });
const normalUserTwoToken = sign({ username: dragonrider.username, id: dragonrider._id.toString() });
const normalUserOneId = magic._id.toString();
const normalUserTwoId = dragonrider._id.toString();

describe('actions', () => {
  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers()));

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

