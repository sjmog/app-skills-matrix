import request from 'supertest';
import { expect } from 'chai';

import app from '../backend';
import { prepopulateUsers, users, insertTemplate, clearDb, insertSkill, insertEvaluation, assignMentor, getEvaluations, skillStatus } from './helpers';
import { sign, cookieName } from '../backend/models/auth';
import templateFixture from './fixtures/templates.json';
import skillsFixture from './fixtures/skills.json';
import evaluationFixture from './fixtures/evaluations.json';

const [, completedEvaluation] = evaluationFixture;

const prefix = '/skillz';

let adminToken;
let normalUserOneToken;
let adminUserId;
let normalUserOneId;
let normalUserTwoId;

describe('userEvaluations', () => {
  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(templateFixture[0]))
      .then(() => skillsFixture.map(insertSkill))
      .then(() =>
        Promise.all([
          users.findOne({ email: 'dmorgantini@gmail.com' }),
          users.findOne({ email: 'user@magic.com' }),
          users.findOne({ email: 'user@dragon-riders.com' }),
        ])
          .then(([adminUser, normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ username: normalUserOne.username, id: normalUserOne._id });
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserOneId = normalUserOne._id;
            normalUserTwoId = normalUserTwo._id;
            adminUserId = adminUser._id;
          }))
      .then(() => assignMentor(normalUserOneId, normalUserTwoId)));

  describe('POST /users/:userId/evaluations', () => {
    it('allows admin user to create an evaluation for a user', () =>
      request(app)
        .post(`${prefix}/users/${normalUserOneId}/evaluations`)
        .send({ action: 'create' })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(getEvaluations)
        .then((evaluationList) => {
          // see ./unit/evaluation-test.js for test to ensure evaluation is correctly generated
          expect(evaluationList.length).to.equal(1);
        }));

    it('takes previous evaluation into account when making new evaluation', () =>
      insertEvaluation(completedEvaluation, normalUserOneId)
        .then(() =>
          request(app)
            .post(`${prefix}/users/${normalUserOneId}/evaluations`)
            .send({ action: 'create' })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(201)
            .then(getEvaluations)
            .then(([, secondEvaluation]) => {
              // see ./unit/evaluation-test.js for test to ensure evaluation is correctly generated
              expect(secondEvaluation).to.be.not.null;
              expect(skillStatus(secondEvaluation.skills, 2)).to.deep.equal({
                previous: 'FEEDBACK',
                current: null,
              });
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

    errorCases.forEach(test =>
      it(`handles error case: ${test().desc}`, () =>
        request(app)
          .post(`${prefix}/users/${test().userId}/evaluations`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });
});
