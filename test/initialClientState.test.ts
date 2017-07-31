import * as request from 'supertest';
import { expect } from 'chai';
import * as moment from 'moment';

import app from '../backend/app';
import helpers from './helpers';
import auth from '../backend/models/auth';
import templatesFixture from './fixtures/templates';
import skillsFixture from './fixtures/skills';
import evaluationsFixture from './fixtures/evaluations';

const { sign, cookieName } = auth;
const { prepopulateUsers, users, insertTemplate, assignTemplate, clearDb, insertSkill, insertEvaluation, assignMentor } = helpers;
const [template] = templatesFixture;
const [evaluation] = evaluationsFixture;

const beforeNow = moment().subtract(1, 'days').toDate();
const now = moment().toDate();

let adminToken;
let normalUserOneToken;
let adminUserId;
let normalUserOneId;
let normalUserTwoId;

const getInitialState = str => JSON.parse(str.match(/REDUX_STATE=(.*)/)[0].substr(12));

describe('initial client state', () => {
  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(template))
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
            normalUserOneId = String(normalUserOne._id);
            normalUserTwoId = String(normalUserTwo._id);
            adminUserId = String(adminUser._id);
          })));

  describe('normal user', () => {
    it('returns HTML with a script tag containing initial state', () =>
      request(app)
        .get('/')
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(200)
        .then((res) => {
          const expectedState = {
            user: {
              evaluations: [],
              menteeEvaluations: [],
              mentorDetails: null,
              template: {
                id: 'eng-nodejs',
                name: 'Node JS Dev',
              },
              userDetails: {
                email: 'user@magic.com',
                name: 'User Magic',
                id: normalUserOneId,
                templateId: 'eng-nodejs',
                username: 'magic',
              },
            },
          };

          expect(getInitialState(res.text)).to.deep.equal(expectedState);
        }));

    it('returns initial state with evaluations from newest to oldest', () => {
      let oldEvaluationId;
      let newEvaluationId;

      return insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow }), normalUserOneId)
        .then(({ insertedId }) => {
          oldEvaluationId = insertedId;
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now }), normalUserOneId))
        .then(({ insertedId }) => {
          newEvaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const [firstEvaluation, secondEvaluation] = getInitialState(res.text).user.evaluations;

              expect(firstEvaluation.id).to.equal(String(newEvaluationId));
              expect(firstEvaluation).to.have.property('createdDate');
              expect(firstEvaluation.status).to.equal('NEW');
              expect(firstEvaluation.templateName).to.equal('Node JS Dev');
              expect(firstEvaluation.evaluationUrl).to.equal(`/evaluations/${String(newEvaluationId)}`);
              expect(firstEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${String(newEvaluationId)}/feedback`);
              expect(firstEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${String(newEvaluationId)}/objectives`);
              expect(firstEvaluation.view).to.equal('SUBJECT');

              expect(secondEvaluation.id).to.equal(String(oldEvaluationId));
            }));
    });

    it('returns initial state with mentee evaluations from newest to oldest', () => {
      let oldMenteeEvaluationId;
      let newMenteeEvaluationId;

      return assignMentor(normalUserTwoId, normalUserOneId)
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow }), normalUserTwoId))
        .then(({ insertedId }) => {
          oldMenteeEvaluationId = insertedId;
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now }), normalUserTwoId))
        .then(({ insertedId }) => {
          newMenteeEvaluationId = insertedId;
        })
        .then(() => request(app)
          .get('/')
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(200)
          .then((res) => {
            const [mentee] = getInitialState(res.text).user.menteeEvaluations;
            const [firstEvaluation, secondEvaluation] = mentee.evaluations;

            expect(mentee.name).to.equal('User Dragon Rider');

            expect(firstEvaluation.id).to.equal(String(newMenteeEvaluationId));
            expect(firstEvaluation).to.have.property('createdDate');
            expect(firstEvaluation.status).to.equal('NEW');
            expect(firstEvaluation.templateName).to.equal('Node JS Dev');
            expect(firstEvaluation.evaluationUrl).to.equal(`/evaluations/${String(newMenteeEvaluationId)}`);
            expect(firstEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserTwoId)}/evaluations/${String(newMenteeEvaluationId)}/feedback`);
            expect(firstEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserTwoId)}/evaluations/${String(newMenteeEvaluationId)}/objectives`);
            expect(firstEvaluation.view).to.equal('MENTOR');

            expect(secondEvaluation.id).to.equal(String(oldMenteeEvaluationId));
          }));
    });

    it('returns initial state with mentor', () =>
      assignMentor(normalUserOneId, adminUserId)
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const expectedMentor = {
                email: 'dmorgantini@gmail.com',
                name: 'David Morgantini',
                username: 'dmorgantini',
                id: adminUserId,
              };

              expect(getInitialState(res.text).user.mentorDetails).to.deep.equal(expectedMentor);
            })));

    it('returns initial state with template', () =>
      assignTemplate(normalUserOneId, template.id)
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const expectedTemplate = {
                id: 'eng-nodejs',
                name: 'Node JS Dev',
              };

              expect(getInitialState(res.text).user.template).to.deep.equal(expectedTemplate);
            })));

    it('returns initial state with user', () =>
      assignMentor(normalUserOneId, adminUserId)
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const expectedUser = {
                email: 'user@magic.com',
                id: normalUserOneId,
                mentorId: adminUserId,
                name: 'User Magic',
                templateId: 'eng-nodejs',
                username: 'magic',
              };

              expect(getInitialState(res.text).user.userDetails).to.deep.equal(expectedUser);
            })));
  });

  describe('admin user', () => {
    it('returns HTML with a script tag containing initial state', () =>
      request(app)
        .get('/admin')
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => {
          expect(getInitialState(res.text)).to.have.property('matrices');
          expect(getInitialState(res.text)).to.have.property('users');
        }));

    it('returns initial state with all templates', () =>
      request(app)
        .get('/admin')
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => {
          const expectedTemplates = [
            {
              id: 'eng-nodejs',
              name: 'Node JS Dev',
            },
          ];

          expect(getInitialState(res.text).matrices.templates).to.deep.equal(expectedTemplates);
        }));

    it('returns initial state with all users', () =>
      request(app)
        .get('/admin')
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => {
          const expectedUsers = [
            {
              email: 'dmorgantini@gmail.com',
              id: adminUserId,
              name: 'David Morgantini',
              username: 'dmorgantini',
              evaluations: [],
            },
            {
              email: 'user@magic.com',
              id: normalUserOneId,
              name: 'User Magic',
              username: 'magic',
              templateId: 'eng-nodejs',
              evaluations: [],
            },
            {
              email: 'user@dragon-riders.com',
              id: normalUserTwoId,
              name: 'User Dragon Rider',
              username: 'dragon-riders',
              evaluations: [],
            },
          ];

          expect(getInitialState(res.text).users.users).to.deep.equal(expectedUsers);
        }));

    it('returns initial state with all users and their evaluations (newest to oldest)', () => {
      let oldEvaluationId;
      let newEvaluationId;

      return insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow }), normalUserOneId)
        .then(({ insertedId }) => {
          oldEvaluationId = String(insertedId);
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now }), normalUserOneId))
        .then(({ insertedId }) => {
          newEvaluationId = String(insertedId);
        })
        .then(() =>
          request(app)
            .get('/admin')
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then((res) => {
              const [userOne, userTwo, userThree] = getInitialState(res.text).users.users;

              expect(userOne.evaluations).to.eql([]);
              expect(userThree.evaluations).to.eql([]);

              const [firstEvaluation, secondEvaluation] = userTwo.evaluations;

              expect(firstEvaluation.createdDate).to.equal(now.toISOString());
              expect(firstEvaluation.evaluationUrl).to.equal(`/evaluations/${newEvaluationId}`);
              expect(firstEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${newEvaluationId}/feedback`);
              expect(firstEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${newEvaluationId}/objectives`);
              expect(firstEvaluation.id).to.equal(newEvaluationId);
              expect(firstEvaluation.status).to.equal('NEW');
              expect(firstEvaluation.templateName).to.equal('Node JS Dev');
              expect(firstEvaluation.view).to.equal('ADMIN');

              expect(secondEvaluation.createdDate).to.equal(beforeNow.toISOString());
              expect(secondEvaluation.evaluationUrl).to.equal(`/evaluations/${oldEvaluationId}`);
              expect(secondEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${oldEvaluationId}/feedback`);
              expect(secondEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${oldEvaluationId}/objectives`);
              expect(secondEvaluation.id).to.equal(oldEvaluationId);
              expect(secondEvaluation.status).to.equal('NEW');
              expect(secondEvaluation.templateName).to.equal('Node JS Dev');
              expect(secondEvaluation.view).to.equal('ADMIN');
            }));
    });
  });
});
