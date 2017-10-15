import * as request from 'supertest';
import { expect } from 'chai';
import * as Promise from 'bluebird';
import { ObjectID } from 'mongodb';

import app from '../backend/app';
import templateData from './fixtures/templates';
import skillsFixture from './fixtures/skills';
import evaluationsFixture from './fixtures/evaluations';
import auth from '../backend/models/auth';
import helpers from './helpers';
import { STATUS } from '../backend/models/evaluations/evaluation';

const { sign, cookieName } = auth;
const [evaluationOne, evaluationTwo, evaluationThree] = evaluationsFixture;
const {
  prepopulateUsers,
  users,
  assignMentor,
  assignLineManager,
  evaluations,
  insertTemplate,
  clearDb,
  insertSkill,
  insertEvaluation,
} = helpers;


const prefix = '/skillz';

let userOneId;
let userOneToken;
let userTwoId;
let userTwoToken;
let userThreeId;
let userThreeToken;

let evaluationId;

describe('Tasks', () => {
  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(templateData[0]))
      .then(() => skillsFixture.map(insertSkill))
      .then(() =>
        Promise.all([
          users.findOne({ email: 'user@magic.com' }),
          users.findOne({ email: 'user@dragon-riders.com' }),
          users.findOne({ email: 'dmorgantini@gmail.com' }),
        ])
          .then(([userOne, userTwo, userThree]) => {
            userOneToken = sign({ username: userOne.username, id: userOne._id });
            userTwoToken = sign({ username: userTwo.username, id: userTwo._id });
            userThreeToken = sign({ username: userThree.username, id: userThree._id });
            userOneId = String(userOne._id);
            userTwoId = String(userTwo._id);
            userThreeId = String(userThree._id);
          }))
      .then(() => {
        evaluationId = null;
      }));

  describe('GET /tasks/:userId', () => {
    describe('success:', () => {
      it('returns a task when a user has a new evaluation', () => {
        const newEvaluation = { ...evaluationOne, status: STATUS.NEW };

        return insertEvaluation(newEvaluation, userOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userOneId}`)
              .set('Cookie', `${cookieName}=${userOneToken}`)
              .expect(200))
          .then(({ body }) => {
            expect(body).to.be.length(1);
            expect(body[0].testId).to.equal('NEW_EVALUATION');
            expect(body[0].message).to.be.a('string').with.length.above(1);
            expect(body[0].link).to.contain(evaluationId);
          });
      });

      it('returns an empty list when a user has no new evaluations', () => {
        const completedEvaluation = { ...evaluationOne, status: STATUS.COMPLETE };
        const selfEvaluationComplete = { ...evaluationTwo, status: STATUS.SELF_EVALUATION_COMPLETE };

        return Promise.all([
          insertEvaluation(completedEvaluation, userOneId),
          insertEvaluation(selfEvaluationComplete, userOneId),
        ])
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userOneId}`)
              .set('Cookie', `${cookieName}=${userOneToken}`)
              .expect(200))
          .then(({ body }) => expect(body).to.eql([]));
      });

      it(`returns a task for a mentor whose mentee has completed their self-evaluation`, () => {
        const selfEvaluationComplete = { ...evaluationOne, status: STATUS.SELF_EVALUATION_COMPLETE };

        return assignMentor(userOneId, userTwoId)
          .then(() => insertEvaluation(selfEvaluationComplete, userOneId, 'USER_NAME'))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userTwoId}`)
              .set('Cookie', `${cookieName}=${userTwoToken}`)
              .expect(200))
          .then(({ body }) => {
            expect(body).to.be.length(1);
            expect(body[0].testId).to.equal('REVIEW_MENTEE_EVALUATION');
            expect(body[0].message).to.contain('USER_NAME');
            expect(body[0].link).to.contain(evaluationId);
          });
      });

      it(`does not return a task for a mentor that has no mentee evaluations that need reviewing`, () => {
        const newEvaluation = { ...evaluationOne, status: STATUS.NEW };

        return assignMentor(userOneId, userTwoId)
          .then(() => insertEvaluation(newEvaluation, userOneId, 'USER_NAME'))
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userTwoId}`)
              .set('Cookie', `${cookieName}=${userTwoToken}`)
              .expect(200))
          .then(({ body }) => expect(body).to.eql([]));
      });

      it(`returns a task for a line manager when their report has a mentor reviewed evaluation`, () => {
        const mentorReviewComplete = { ...evaluationOne, status: STATUS.MENTOR_REVIEW_COMPLETE };

        return assignLineManager(userOneId, userTwoId)
          .then(() => insertEvaluation(mentorReviewComplete, userOneId, 'USER_NAME'))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userTwoId}`)
              .set('Cookie', `${cookieName}=${userTwoToken}`)
              .expect(200))
          .then(({ body }) => {
            expect(body).to.be.length(1);
            expect(body[0].testId).to.equal('REVIEW_REPORT_EVALUATION');
            expect(body[0].message).to.contain('USER_NAME');
            expect(body[0].link).to.contain(evaluationId);
          });
      });

      it(`does not return a task for a line manager with no report evaluations that need reviewing`, () => {
        const newEvaluation = { ...evaluationOne, status: STATUS.NEW };

        return assignLineManager(userOneId, userTwoId)
          .then(() => insertEvaluation(newEvaluation, userOneId, 'USER_NAME'))
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userTwoId}`)
              .set('Cookie', `${cookieName}=${userTwoToken}`)
              .expect(200))
          .then(({ body }) => expect(body).to.eql([]));
      });

      it(`returns a task for a line manager & mentor whose mentee/report has completed their self-evaluation`, () => {
        const selfEvaluationComplete = { ...evaluationOne, status: STATUS.SELF_EVALUATION_COMPLETE };

        return Promise.all([
          assignMentor(userOneId, userTwoId),
          assignLineManager(userOneId, userTwoId),
        ])
          .then(() => insertEvaluation(selfEvaluationComplete, userOneId, 'USER_NAME'))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userTwoId}`)
              .set('Cookie', `${cookieName}=${userTwoToken}`)
              .expect(200))
          .then(({ body }) => {
            expect(body).to.be.length(1);
            expect(body[0].testId).to.equal('REVIEW_MENTEE_EVALUATION');
            expect(body[0].message).to.contain('USER_NAME');
            expect(body[0].link).to.contain(evaluationId);
          });
      });

      it(`does not return a task for a line manager & mentor whose mentee/report does not need their evaluation reviewed`, () => {
        const newEvaluation = { ...evaluationOne, status: STATUS.NEW };

        return Promise.all([
          assignMentor(userOneId, userTwoId),
          assignLineManager(userOneId, userTwoId),
        ])
          .then(() => insertEvaluation(newEvaluation, userOneId, 'USER_NAME'))
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userTwoId}`)
              .set('Cookie', `${cookieName}=${userTwoToken}`)
              .expect(200))
          .then(({ body }) => expect(body).to.eql([]));
      });

      it('returns multiple tasks', () => {
        const newEvaluation = { ...evaluationOne, status: STATUS.NEW };
        const selfEvaluationComplete = { ...evaluationTwo, status: STATUS.SELF_EVALUATION_COMPLETE };
        const mentorReviewComplete = { ...evaluationThree, status: STATUS.MENTOR_REVIEW_COMPLETE };

        return Promise.all([
          insertEvaluation(newEvaluation, userOneId),
          insertEvaluation(selfEvaluationComplete, userTwoId),
          insertEvaluation(mentorReviewComplete, userThreeId),
          assignMentor(userTwoId, userOneId),
          assignLineManager(userThreeId, userOneId),
        ])
          .then(([{ insertedId }]) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .get(`${prefix}/tasks/${userOneId}`)
              .set('Cookie', `${cookieName}=${userOneToken}`)
              .expect(200))
          .then(({ body }) => {
            expect(body).to.have.length(3);
            expect(body[0].testId).to.equal('NEW_EVALUATION');
            expect(body[0].message).to.be.a('string').with.length.above(1);
            expect(body[0].link).to.contain(evaluationId);
            expect(body[1].testId).to.equal('REVIEW_MENTEE_EVALUATION');
            expect(body[2].testId).to.equal('REVIEW_REPORT_EVALUATION');
          });
      });

      it('returns an empty task list when a user has no evaluations, mentees nor reports', () =>
        request(app)
          .get(`${prefix}/tasks/${userOneId}`)
          .set('Cookie', `${cookieName}=${userOneToken}`)
          .expect(200)
          .then(({ body }) => expect(body).to.eql([])));
    });

    describe('failure:', () => {
      it('returns not found when a user is missing', () => {
        const missingUser = new ObjectID();

        return request(app)
          .get(`${prefix}/tasks/${missingUser}`)
          .set('Cookie', `${cookieName}=${userOneToken}`)
          .expect(404);
      });

      it('returns unauthorised when a user is not logged in', () =>
        request(app)
          .get(`${prefix}/tasks/${userOneId}`)
          .expect(401));

      it('returns forbidden when a user attempts to view the tasks of someone else', () =>
        request(app)
          .get(`${prefix}/tasks/${userOneId}`)
          .set('Cookie', `${cookieName}=${userTwoToken}`)
          .expect(403));
    });
  });
});

