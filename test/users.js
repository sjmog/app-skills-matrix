const request = require('supertest');
const { expect } = require('chai');
const { ObjectId } = require('mongodb');

const app = require('../backend');
const { prepopulateUsers, users, templates, insertTemplate } = require('./helpers');
const [ sampleTemplate ] = require('./fixtures/templates.json');
const { sign, cookieName } = require('../backend/models/auth');

const prefix = '/skillz';

const templateId = 'eng-nodejs';

let adminToken, normalUserToken;
let adminUserId, normalUserId;

beforeEach(() =>
  Promise.all([prepopulateUsers(), templates.remove({})])
    .then(() =>
      Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
        .then(([adminUser, normalUser]) => {
          adminToken = sign({ email: adminUser.email, id: adminUser._id });
          normalUserToken = sign({ email: normalUser.email, id: normalUser._id });
          normalUserId = normalUser._id;
          adminUserId = adminUser._id;
        }))
    .then(() => templates.remove({})));

describe('POST /users', () => {
  it('should let admin create users', () =>
    request(app)
      .post(`${prefix}/users`)
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
      .then((res) => users.findOne({ _id: new ObjectId(normalUserId) }))
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
  ].forEach((test) =>
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
      .then((res) => users.findOne({ _id: new ObjectId(normalUserId) }))
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
  ].forEach((test) =>
    it(`should handle error cases '${test().desc}'`, () =>
      request(app)
        .post(`${prefix}/users/${test().userId}`)
        .send(test().body)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)));
});
