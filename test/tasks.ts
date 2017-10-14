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
let noteId;

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
        noteId = null;
      }));

  describe('GET /tasks/:userId', () => {
    it('returns a task when a user has a new evaluation', () => {
      const newEvaluation = { ...evaluationOne, status: STATUS.NEW };

      return insertEvaluation(newEvaluation, userOneId)
        .then(({ insertedId }) => {
          evaluationId = String(insertedId);
        })
        .then(() =>
          request(app)
            .get(`${prefix}/tasks/${userOneId}`)
            .set('Cookie', `${cookieName}=${userOneToken}`)
            .expect(200))
        .then(({ body }) => {

          expect(body.tasks).to.be.length(1);
          expect(body.tasks[0].testId).to.eql('NEW_EVALUATION');
          expect(body.tasks[0].message).to.be.a('string').with.length.above(1);
          expect(body.tasks[0].link).to.contain(evaluationId);
        });
    });

    it('returns an empty list when a user has no evaluations', () => {
      return request(app)
        .get(`${prefix}/tasks/${userOneId}`)
        .set('Cookie', `${cookieName}=${userOneToken}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.tasks).to.eql([]);
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
        .then(({ body }) => {
          expect(body.tasks).to.eql([]);
        });
    });

    it('returns not found when a user is missing', () => {
      const missingUser = new ObjectID();

      return request(app)
        .get(`${prefix}/tasks/${missingUser}`)
        .set('Cookie', `${cookieName}=${userOneToken}`)
        .expect(404);
    });

    it('returns unauthorised when a user is not logged in', () => {
      return request(app)
        .get(`${prefix}/tasks/${userOneId}`)
        .expect(401);
    });

    // TODO: Make sure this is tested manually.
    it('returns forbidden when a user attempts to view the tasks that are not their own', () => {
      return request(app)
        .get(`${prefix}/tasks/${userOneId}`)
        .set('Cookie', `${cookieName}=${userTwoToken}`)
        .expect(403);
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
          expect(body.tasks).to.be.length(1);
          expect(body.tasks[0].testId).to.equal('REVIEW_MENTEE_EVALUATION');
          expect(body.tasks[0].message).to.contain('USER_NAME');
          expect(body.tasks[0].link).to.contain(evaluationId);
        });
    });

    it(`does not return a task for a mentor whose mentee has has an evaluation with a status that is NOT SELF_EVALUATION_COMPLETE`, () => {
      const newEvaluation = { ...evaluationOne, status: STATUS.NEW };

      return assignMentor(userOneId, userTwoId)
        .then(() => insertEvaluation(newEvaluation, userOneId, 'USER_NAME'))
        .then(() =>
          request(app)
            .get(`${prefix}/tasks/${userTwoId}`)
            .set('Cookie', `${cookieName}=${userTwoToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body.tasks).to.eql([]);
        });
    });

    it(`returns a task for a line manager whose report has a mentor reviewed evaluation`, () => {
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
          expect(body.tasks).to.be.length(1);
          expect(body.tasks[0].testId).to.contain('REVIEW_REPORT_EVALUATION');
          expect(body.tasks[0].message).to.contain('USER_NAME');
          expect(body.tasks[0].link).to.contain(evaluationId);
        });
    });

    it(`does not return a task for a line manager whose report has an evaluation that has a status other than MENTOR_REIVEW_COMPLETE`, () => {
      const newEvaluation = { ...evaluationOne, status: STATUS.NEW };

      return assignLineManager(userOneId, userTwoId)
        .then(() => insertEvaluation(newEvaluation, userOneId, 'USER_NAME'))
        .then(() =>
          request(app)
            .get(`${prefix}/tasks/${userTwoId}`)
            .set('Cookie', `${cookieName}=${userTwoToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body.tasks).to.eql([]);
        });
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
          expect(body.tasks).to.be.length(1);
          expect(body.tasks[0].testId).to.contain('REVIEW_MENTEE_EVALUATION');
          expect(body.tasks[0].message).to.contain('USER_NAME');
          expect(body.tasks[0].link).to.contain(evaluationId);
        });
    });

    it(`does not return a task for a line manager & mentor whose mentee/report has not completed their self-evaluation`, () => { // TODO: What about complete?
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
        .then(({ body }) => {
          expect(body.tasks).to.eql([]);
        });
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
          expect(body.tasks).to.have.length(3);
          expect(body.tasks[0].testId).to.contain('NEW_EVALUATION');
          expect(body.tasks[0].message).to.be.a('string').with.length.above(1);
          expect(body.tasks[0].link).to.contain(evaluationId);
          expect(body.tasks[1].testId).to.contain('REVIEW_MENTEE_EVALUATION');
          expect(body.tasks[2].testId).to.contain('REVIEW_REPORT_EVALUATION');
        });
    });
  });
});

