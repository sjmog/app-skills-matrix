import request from 'supertest';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';

import app from '../backend/app';
import { prepopulateUsers, users, insertTemplate, clearDb } from './helpers';
import templateFixture from './fixtures/templates.json';
import { sign, cookieName } from '../backend/models/auth';

const [sampleTemplate] = templateFixture;

const prefix = '/skillz';

const templateId = 'eng-nodejs';

let adminToken;
let normalUserToken;
let adminUserId;
let normalUserId;

describe('users', () => {
  beforeEach(() =>
    clearDb()
      .then(prepopulateUsers)
      .then(() =>
        Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
          .then(([adminUser, normalUser]) => {
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserToken = sign({ username: normalUser.username, id: normalUser._id });
            normalUserId = normalUser._id;
            adminUserId = adminUser._id;
          })));

  describe('POST /users', () => {
    it('should let admin create users', () =>
      request(app)
        .post(`${prefix}/users`)
        .send({ username: 'newuser', email: 'newuser@user.com', name: 'new name', action: 'create' })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(res => users.findOne({ email: res.body.email }))
        .then((newUser) => {
          expect(newUser.email).to.equal('newuser@user.com');
          expect(newUser.name).to.equal('new name');
        }));

    [
      () => ({
        desc: 'not authorized',
        token: normalUserToken,
        body: { username: 'newuser', email: 'newuser@user.com', name: 'new name', action: 'create' },
        expect: 403,
      }),
      () => ({
        desc: 'conflict',
        token: adminToken,
        body: { username: 'magic', email: 'user@magic.com', name: 'new name', action: 'create' },
        expect: 409,
      }),
      () => ({
        desc: 'bad action',
        token: adminToken,
        body: { username: 'newuser', email: 'user@magic.com', name: 'new name', action: 'foo' },
        expect: 400,
      }),
    ].forEach(test =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/users`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });

  describe('POST /users/:userId { action: selectMentor }', () => {
    it('should let admin select a mentor', () =>
      request(app)
        .post(`${prefix}/users/${normalUserId}`)
        .send({ mentorId: adminUserId, action: 'selectMentor' })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then(() => users.findOne({ _id: new ObjectId(normalUserId) }))
        .then((updatedUser) => {
          expect(updatedUser.mentorId).to.equal(adminUserId.toString());
        }));

    [
      () => ({
        desc: 'not authorized',
        token: normalUserToken,
        body: { mentorId: adminUserId, action: 'selectMentor' },
        userId: normalUserId,
        expect: 403,
      }),
      () => ({
        desc: 'no user',
        token: adminToken,
        body: { mentorId: adminUserId, action: 'selectMentor' },
        userId: '58a237c185b8790720deb924',
        expect: 404,
      }),
      () => ({
        desc: 'bad action',
        token: adminToken,
        body: { mentorId: adminUserId, action: 'foo' },
        userId: normalUserId,
        expect: 400,
      }),
      () => ({
        desc: 'can not mentor themselves',
        token: adminToken,
        body: { mentorId: normalUserId, action: 'selectMentor' },
        userId: normalUserId,
        expect: 400,
      }),
    ].forEach(test =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/users/${test().userId}`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });

  describe('POST /users/:userId { action: selectTemplate }', () => {
    it('should let admin select a template for a user', () =>
      insertTemplate(sampleTemplate)
        .then(() =>
          request(app)
            .post(`${prefix}/users/${normalUserId}`)
            .send({ templateId, action: 'selectTemplate' })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200))
        .then(() => users.findOne({ _id: new ObjectId(normalUserId) }))
        .then((updatedUser) => {
          expect(updatedUser.templateId).to.equal(templateId);
        }));

    [
      () => ({
        desc: 'not authorized',
        token: normalUserToken,
        body: { templateId, action: 'selectTemplate' },
        userId: normalUserId,
        expect: 403,
      }),
      () => ({
        desc: 'no user',
        token: adminToken,
        body: { templateId, action: 'selectTemplate' },
        userId: '58a237c185b8790720deb924',
        expect: 404,
      }),
      () => ({
        desc: 'template not found',
        token: adminToken,
        body: { templateId: 'does-not-exist-lolz', action: 'selectTemplate' },
        userId: normalUserId,
        expect: 400,
      }),
    ].forEach(test =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/users/${test().userId}`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });
});
