const request = require('supertest');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulateUsers, users, evaluations, insertTemplate, clearDb, insertSkill, insertEvaluation, assignMentor } = require('./helpers');
const { sign, cookieName } = require('../backend/models/auth');
const templateData = require('./fixtures/templates');
const skills = require('./fixtures/skills');
const [evaluation] = require('./fixtures/evaluations');

const prefix = '/skillz';
const templateId = 'eng-nodejs';

let adminToken, normalUserOneToken, normalUserTwoToken;
let adminUserId, normalUserOneId, normalUserTwoId;

describe('userEvaluations', () => {

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(templateData[0]))
      .then(() => skills.map(insertSkill))
      .then(() =>
        Promise.all([
          users.findOne({ email: 'dmorgantini@gmail.com' }),
          users.findOne({ email: 'user@magic.com' }),
          users.findOne({ email: 'user@dragon-riders.com' })
        ])
          .then(([adminUser, normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ email: normalUserOne.email, id: normalUserOne._id });
            normalUserTwoToken = sign({ email: normalUserTwo.email, id: normalUserTwo._id });
            adminToken = sign({ email: adminUser.email, id: adminUser._id });
            normalUserOneId = normalUserOne._id;
            normalUserTwoId = normalUserTwo._id;
            adminUserId = adminUser._id;
          }))
      .then(() => assignMentor(normalUserOneId, normalUserTwoId)));

  describe('POST /users/:userId/evaluations', () => {
    it('allows admin user to create an evaluation for a user', () =>
      request(app)
        .post(`${prefix}/users/${normalUserOneId}`)
        .send({ templateId, action: 'selectTemplate' })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .then(() =>
          request(app)
            .post(`${prefix}/users/${normalUserOneId}/evaluations`)
            .send({ action: 'create' })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(201)
            .then(() => evaluations.find({}))
            .then((results) => results.toArray())
            .then((evaluationList) => {
              // see ./unit/evaluation-test.js for test to ensure evaluation is correctly generated
              expect(evaluationList.length).to.equal(1);
            })));

    const errorCases = [
      () => ({
        desc: 'not authorized',
        token: normalUserOneToken,
        body: { action: 'create' },
        userId: normalUserOneToken,
        expect: 403,
      }),
      () => ({
        desc: 'no user',
        token: adminToken,
        body: { action: 'create' },
        userId: '58a237c185b8790720deb924',
        expect: 404,
      }),
      () => ({
        desc: 'bad action',
        token: adminToken,
        body: { action: 'foo' },
        userId: normalUserOneToken,
        expect: 400,
      }),
      () => ({
        desc: 'no template selected for user',
        token: adminToken,
        body: { action: 'create' },
        userId: adminUserId,
        expect: 400,
      }),
    ];

    errorCases.forEach((test) =>
      it(`handles error case: ${test().desc}`, () =>
        request(app)
          .post(`${prefix}/users/${test().userId}/evaluations`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));

  });
});
