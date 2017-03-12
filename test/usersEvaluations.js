const request = require('supertest');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulateUsers, users, evaluations, insertTemplate, clearDb, insertSkill, insertEvaluation } = require('./helpers');
const { sign, cookieName } = require('../backend/models/auth');
const templateData = require('./fixtures/templates');
const skills = require('./fixtures/skills');
const [ evaluation ] = require('./fixtures/evaluations');

const prefix = '/skillz';
const templateId = 'eng-nodejs';

let adminToken, normalUserOneToken, normalUserTwoToken;
let adminUserId, normalUserOneId, normalUserTwoId;

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
        })));

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

describe('GET /evaluation/:evaluationId', () => {
  let evaluationId;

  beforeEach(() =>
    insertEvaluation(Object.assign({}, evaluation, { user: { id: String(normalUserOneId) } }))
      .then(({ insertedId }) => {
        evaluationId = insertedId
      })
  );

  it('allows a user to retrieve their evaluation', () =>
    request(app)
      .get(`${prefix}/evaluations/${evaluationId}`)
      .set('Cookie', `${cookieName}=${normalUserOneToken}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.id).to.equal(String(normalUserOneId));
        expect(body.template.name).to.equal('Node JS Dev');
        expect(body.skillGroups.length > 0).to.equal(true);
      }));

  const errorCases = [
    () => ({
      desc: 'no evaluation',
      token: normalUserOneToken,
      evaluationId: 'noMatchingId',
      expect: 404,
    }),
    () => ({
      desc: 'user not subject of evaluation',
      token: normalUserTwoToken,
      evaluationId,
      expect: 403,
    })
  ];

  errorCases.forEach((test) =>
    it(`handles error case:${test().desc}`, () =>
      request(app)
        .get(`${prefix}/evaluations/${test().evaluationId}`)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)))
});

describe('POST /evaluations/:evaluationId/update-skill-status', () => {
  let evaluationId;

  beforeEach(() =>
    insertEvaluation(Object.assign({}, evaluation, { user: { id: String(normalUserOneId) } }))
      .then(({ insertedId }) => {
        evaluationId = insertedId
      })
  );

  it('allows a user to update the status of a skill', () =>
    request(app)
      .post(`${prefix}/evaluations/${evaluationId}/update-skill-status`)
      .send({
        action: 'updateSkillStatus',
        skillGroupId: 0,
        skillId: 1,
        status: 'ATTAINED'
      })
      .set('Cookie', `${cookieName}=${normalUserOneToken}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.skillId).to.equal(1);
        expect(body.status).to.equal('ATTAINED');
      })
      .then(() => evaluations.findOne({ _id: evaluationId }))
      .then(({ skillGroups }) => {
        expect(skillGroups[0].skills[0].status).to.deep.equal({ previous: null, current: 'ATTAINED' });
      }));

  const errorCases = [
    () => ({
      desc: 'no evaluation',
      token: normalUserOneToken,
      evaluationId: 'noMatchingId',
      body: { action: 'updateSkillStatus' },
      expect: 404,
    }),
    () => ({
      desc: 'user not subject of evaluation',
      token: normalUserTwoToken,
      evaluationId,
      body: { action: 'updateSkillStatus' },
      expect: 403,
    }),
  ];

  errorCases.forEach((test) =>
    it(`handles error case: ${test().desc}`, () =>
      request(app)
        .post(`${prefix}/evaluations/${test().evaluationId}/update-skill-status`)
        .send(test().body)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)))
});

describe('POST /evaluations/:evaluationId/complete', () => {
  let evaluationId;

  beforeEach(() =>
    insertEvaluation(Object.assign({}, evaluation, { user: { id: String(normalUserOneId) } }))
      .then(({ insertedId }) => {
        evaluationId = insertedId
      })
  );

  it('allows users to complete their own evaluation', () =>
    request(app)
      .post(`${prefix}/evaluations/${evaluationId}/complete`)
      .send({ action: 'complete', evaluationId })
      .set('Cookie', `${cookieName}=${normalUserOneToken}`)
      .expect(200)
      .then(() => evaluations.findOne({ _id: evaluationId }))
      .then((completedApplication) => {
        expect(completedApplication.status).to.equal('COMPLETE');
      }));

  const errorCases = [
    () => ({
      desc: 'no evaluation',
      evaluationId: 'noMatchingId',
      token: normalUserOneToken,
      body: { action: 'complete' },
      expect: 404,
    }),
    () => ({
      desc: 'user not subject of evaluation',
      evaluationId,
      token: normalUserTwoToken,
      body: { action: 'complete' },
      expect: 403,
    }),
  ];

  errorCases.forEach((test) =>
    it(`handles error case: ${test().desc}`, () =>
      request(app)
        .post(`${prefix}/evaluations/${test().evaluationId}/complete`)
        .send(test().body)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)))
});
