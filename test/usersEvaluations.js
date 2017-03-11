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

let adminToken, normalUserToken;
let adminUserId, normalUserId;

beforeEach(() =>
  clearDb()
    .then(() => prepopulateUsers())
    .then(() => insertTemplate(templateData[0]))
    .then(() => skills.map(insertSkill))
    .then(() =>
      Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
        .then(([adminUser, normalUser]) => {
          normalUserToken = sign({ email: normalUser.email, id: normalUser._id });
          adminToken = sign({ email: adminUser.email, id: adminUser._id });
          normalUserId = normalUser._id;
          adminUserId = adminUser._id;
        })));

describe('POST /users/:userId/evaluations', () => {
  it('should let admin create an evaluation for a user', () =>
    request(app)
      .post(`${prefix}/users/${normalUserId}`)
      .send({ templateId, action: 'selectTemplate' })
      .set('Cookie', `${cookieName}=${adminToken}`)
      .then(() =>
        request(app)
          .post(`${prefix}/users/${normalUserId}/evaluations`)
          .send({ action: 'create' })
          .set('Cookie', `${cookieName}=${adminToken}`)
          .expect(201)
          .then(() => evaluations.find({}))
          .then((results) => results.toArray())
          .then((evaluationList) => {
            // see ./unit/evaluation-test.js for test to ensure evaluation is correctly generated
            expect(evaluationList.length).to.equal(1);
          })));

  [
    () => ({
      desc: 'not authorized',
      token: normalUserToken,
      body: { action: 'create' },
      userId: normalUserId,
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
      userId: normalUserId,
      expect: 400,
    }),
    () => ({ // have not selected a template for this user
      desc: 'no template',
      token: adminToken,
      body: { action: 'create' },
      userId: adminUserId,
      expect: 400,
    }),
  ].forEach((test) =>
    it(`should handle error cases '${test().desc}'`, () =>
      request(app)
        .post(`${prefix}/users/${test().userId}/evaluations`)
        .send(test().body)
        .set('Cookie', `${cookieName}=${test().token}`)
        .expect(test().expect)));

});

describe('GET /evaluation/:evaluationId', () => {
  it('should retrieve an evaluation for any user', () =>
    insertEvaluation(evaluation)
      .then(({ insertedId }) =>
        request(app)
          .get(`${prefix}/evaluations/${insertedId}`)
          .expect(200))
      .then(({ body }) => {
        expect(body.user.id).to.equal('user_id');
        expect(body.template.name).to.equal('Node JS Dev');
        expect(body.skillGroups.length > 0).to.equal(true);
      }));

  [
    () => ({
      desc: 'no evaluation',
      expect: 404,
    })
  ].forEach((test) =>
    it(`should handle error cases '${test().desc}'`, () =>
      request(app)
        .get(`${prefix}/evaluations/noMatchingId`)
        .expect(test().expect)))
});

describe('POST /evaluations/update-skill-status', () => {
  it('allows users to update the status of a skill', () => {
    let evaluationId;

    return insertEvaluation(evaluation)
      .then(({ insertedId }) => {
        evaluationId = insertedId;

        return request(app)
          .post(`${prefix}/evaluations/update-skill-status`)
          .send({
            evaluationId: evaluationId,
            skillGroupId: 0,
            skillId: 1,
            status: 'attained'
          })
          .expect(200)
      })
      .then(({ body }) => {
        expect(body.skillId).to.equal(1);
        expect(body.status).to.equal('attained');
      })
      .then(() => evaluations.findOne({ _id: evaluationId }))
      .then(({ skillGroups }) => {
        expect(skillGroups[0].skills[0].status).to.deep.equal({ previous: null, current: 'attained'});
      })
  })
});
