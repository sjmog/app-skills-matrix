import * as request from 'supertest';
import { expect } from 'chai';

import fixtureUsers from '../fixtures/users';
import app from '../../backend/app';
import helpers from '../helpers';
import auth from '../../backend/models/auth';
import templateFixture from '../fixtures/templates';
import skillsFixture from '../fixtures/skills';
import evaluationFixture from '../fixtures/evaluations';

const { dmorgantini, magic, dragonrider } = fixtureUsers;
const { sign, cookieName } = auth;
const { prepopulateUsers, insertTemplate, clearDb, insertSkill, insertEvaluation, assignMentor, assignLineManager, getEvaluations, skillStatus } = helpers;
const [, completedEvaluation] = evaluationFixture;

const prefix = '/skillz';

const normalUserOneToken = sign({ username: magic.username, id: magic._id.toString() });
const normalUserOneId = magic._id.toString();
const normalUserTwoId = dragonrider._id.toString();
const adminToken = sign({ username: dmorgantini.username, id: dmorgantini._id.toString() });
const adminUserId = String(dmorgantini._id);

describe('userEvaluations', () => {
  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(templateFixture[0]))
      .then(() => skillsFixture.map(insertSkill))
      .then(() => assignMentor(normalUserOneId, normalUserTwoId))
      .then(() => assignLineManager(normalUserOneId, normalUserTwoId)));

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
        userId: normalUserOneId,
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
        userId: normalUserOneId,
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
