import * as request from 'supertest';
import { expect } from 'chai';
import * as moment from 'moment';
import * as R from 'ramda';

import app from '../backend/app';
import helpers from './helpers';
import auth from '../backend/models/auth';
import templatesFixture from './fixtures/templates';
import skillsFixture from './fixtures/skills';
import evaluationsFixture from './fixtures/evaluations';
import { ObjectID } from 'bson';

const { sign, cookieName } = auth;
const { prepopulateUsers, users, insertTemplate, assignTemplate, clearDb, insertSkill, insertEvaluation, assignMentor, assignLineManager } = helpers;
const [template] = templatesFixture;
const [stubEvaluation] = evaluationsFixture;

const beforeNow = moment().subtract(1, 'days').toDate();
const now = moment().toDate();

let adminToken;
let normalUserOneToken;
let adminUserId;
let normalUserOneId;
let normalUserTwoId;

const getInitialState = str => JSON.parse(str.match(/REDUX_STATE=(.*)/)[0].substr(12));

describe('initial client state', () => {
  let evaluation;

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(template))
      .then(() => skillsFixture.map(insertSkill))
      .then(() => {
        evaluation = R.clone(stubEvaluation);
      })
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
      Promise.all([
        assignMentor(normalUserTwoId, normalUserOneId),
        assignLineManager(adminUserId, normalUserOneId),
      ])
        .then(() => request(app)
          .get('/')
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(200))
        .then((res) => {
          const { entities, user } = getInitialState(res.text);

          const userOneEntity = entities.users.entities[normalUserOneId];
          expect(userOneEntity.avatarUrl).to.equal('https://www.tes.com/logo.svg');
          expect(userOneEntity.email).to.equal('user@magic.com');
          expect(userOneEntity.name).to.equal('User Magic');
          expect(userOneEntity.id).to.equal(normalUserOneId);
          expect(userOneEntity.templateId).to.equal('eng-nodejs');
          expect(userOneEntity.username).to.equal('magic');

          const userTwoEntity = entities.users.entities[normalUserTwoId];
          expect(userTwoEntity.username).to.equal('dragon-riders');

          const adminUserEntity = entities.users.entities[adminUserId];
          expect(adminUserEntity.username).to.equal('dmorgantini');

          expect(user).to.eql({
            evaluations: [],
            mentees: [normalUserTwoId],
            reports: [adminUserId],
            mentorDetails: null,
            lineManagerDetails: null,
            template: {
              id: 'eng-nodejs',
              name: 'Node JS Dev',
            },
            userDetails: {
              avatarUrl: 'https://www.tes.com/logo.svg',
              email: 'user@magic.com',
              name: 'User Magic',
              id: normalUserOneId,
              isAdmin: false,
              templateId: 'eng-nodejs',
              username: 'magic',
            },
          });
        }));

    it('returns initial state with evaluations from newest to oldest', () => {
      let oldEvaluationId;
      let newEvaluationId;

      return insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow, _id: new ObjectID() }), normalUserOneId)
        .then(({ insertedId }) => {
          oldEvaluationId = String(insertedId);
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now, _id: new ObjectID() }), normalUserOneId))
        .then(({ insertedId }) => {
          newEvaluationId = String(insertedId);
        })
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const { user, entities } = getInitialState(res.text);
              expect(user.evaluations).to.eql([newEvaluationId, oldEvaluationId]);

              const newEvaluationEntity = entities.evaluations.entities[newEvaluationId];
              const oldEvaluationEntity = entities.evaluations.entities[oldEvaluationId];

              expect(newEvaluationEntity).to.have.property('createdDate');
              expect(newEvaluationEntity.status).to.equal('NEW');
              expect(newEvaluationEntity.template.name).to.equal('Node JS Dev');
              expect(newEvaluationEntity.evaluationUrl).to.equal(`/evaluations/${String(newEvaluationId)}`);
              expect(newEvaluationEntity.feedbackUrl).to.equal(`/evaluations/${String(newEvaluationId)}/feedback`);
              expect(newEvaluationEntity.objectivesUrl).to.equal(`/evaluations/${String(newEvaluationId)}/objectives`);
              expect(newEvaluationEntity.view).to.equal('SUBJECT');

              expect(oldEvaluationEntity.id).to.equal(String(oldEvaluationId));
            }));
    });

    it('returns initial state with mentee evaluations from newest to oldest', () => {
      let oldMenteeEvaluationId;
      let newMenteeEvaluationId;

      return assignMentor(normalUserTwoId, normalUserOneId)
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow, _id: new ObjectID() }), normalUserTwoId))
        .then(({ insertedId }) => {
          oldMenteeEvaluationId = String(insertedId);
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now, _id: new ObjectID() }), normalUserTwoId))
        .then(({ insertedId }) => {
          newMenteeEvaluationId = String(insertedId);
        })
        .then(() => request(app)
          .get('/')
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(200)
          .then((res) => {
            const { user, entities } = getInitialState(res.text);

            expect(user.mentees).to.eql([normalUserTwoId]);
            expect(entities.users.entities[normalUserTwoId].name).to.equal('User Dragon Rider');

            const newMenteeEvaluationEntity = entities.evaluations.entities[newMenteeEvaluationId];
            const oldMenteeEvaluationEntity = entities.evaluations.entities[oldMenteeEvaluationId];

            expect(newMenteeEvaluationEntity.id).to.equal(newMenteeEvaluationId);
            expect(newMenteeEvaluationEntity).to.have.property('createdDate');
            expect(newMenteeEvaluationEntity.status).to.equal('NEW');
            expect(newMenteeEvaluationEntity.template.name).to.equal('Node JS Dev');
            expect(newMenteeEvaluationEntity.evaluationUrl).to.equal(`/evaluations/${newMenteeEvaluationId}`);
            expect(newMenteeEvaluationEntity.feedbackUrl).to.equal(`/evaluations/${newMenteeEvaluationId}/feedback`);
            expect(newMenteeEvaluationEntity.objectivesUrl).to.equal(`/evaluations/${newMenteeEvaluationId}/objectives`);
            expect(newMenteeEvaluationEntity.view).to.equal('MENTOR');

            expect(oldMenteeEvaluationEntity.id).to.equal(oldMenteeEvaluationId);
          }));
    });

    it('returns the user details and evaluations for multiple mentees', () => {
      let mentorEvalOne;
      let mentorEvalTwo;
      let reportEval;

      return Promise.all([
        insertEvaluation({ ...evaluation, _id: new ObjectID() }, normalUserTwoId),
        insertEvaluation({ ...evaluation, _id: new ObjectID() }, normalUserTwoId),
        insertEvaluation({ ...evaluation, _id: new ObjectID() }, adminUserId),
        assignMentor(normalUserTwoId, normalUserOneId),
        assignMentor(adminUserId, normalUserOneId),
        assignLineManager(adminUserId, normalUserOneId),
      ])
        .then(([{ insertedId: mentorEvalOneId }, { insertedId: mentorEvalTwoId }, { insertedId: reportEvalId }]) => {
          mentorEvalOne = String(mentorEvalOneId);
          mentorEvalTwo = String(mentorEvalTwoId);
          reportEval = String(reportEvalId);
        })
        .then(() => request(app)
          .get('/')
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(200)
          .then((res) => {
            const { user, entities } = getInitialState(res.text);

            expect(user.mentees).to.have.length(2);
            expect(user.mentees).to.contain(normalUserTwoId);
            expect(user.mentees).to.contain(adminUserId);

            expect(user.reports).to.eql([adminUserId]);

            expect(entities.users.entities[normalUserTwoId].name).to.equal('User Dragon Rider');
            expect(entities.users.entities[adminUserId].name).to.equal('David Morgantini');

            expect(entities.evaluations.entities[mentorEvalOne].subject.id).to.equal(normalUserTwoId);
            expect(entities.evaluations.entities[mentorEvalOne].view).to.equal('MENTOR');

            expect(entities.evaluations.entities[mentorEvalTwo].subject.id).to.equal(normalUserTwoId);
            expect(entities.evaluations.entities[mentorEvalTwo].view).to.equal('MENTOR');

            expect(entities.evaluations.entities[reportEval].subject.id).to.equal(adminUserId);
            expect(entities.evaluations.entities[reportEval].view).to.equal('LINE_MANAGER_AND_MENTOR');
          }));
    });

    it('sets the correct view for report evaluations', () => {
      let reportEval;

      return Promise.all([
        insertEvaluation({ ...evaluation, _id: new ObjectID() }, adminUserId),
        assignLineManager(adminUserId, normalUserOneId),
      ])
        .then(([{ insertedId: reportEvalId }]) => {
          reportEval = String(reportEvalId);
        })
        .then(() => request(app)
          .get('/')
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(200)
          .then((res) => {
            const { user, entities } = getInitialState(res.text);

            expect(user.reports).to.eql([adminUserId]);
            expect(entities.users.entities[adminUserId].name).to.equal('David Morgantini');

            expect(entities.evaluations.entities[reportEval].subject.id).to.equal(adminUserId);
            expect(entities.evaluations.entities[reportEval].view).to.equal('LINE_MANAGER');
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
                avatarUrl: 'https://www.tes.com/logo.svg',
                email: 'dmorgantini@gmail.com',
                name: 'David Morgantini',
                username: 'dmorgantini',
                id: adminUserId,
                isAdmin: true,
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
                avatarUrl: 'https://www.tes.com/logo.svg',
                email: 'user@magic.com',
                id: normalUserOneId,
                isAdmin: false,
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
          expect(getInitialState(res.text)).to.have.property('evaluations');
          expect(getInitialState(res.text)).to.have.property('user');
        }));

    it('returns initial state with logged in user details', () =>
      request(app)
        .get('/admin')
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => {
          expect(getInitialState(res.text).user.username).to.eql('dmorgantini');
          expect(getInitialState(res.text).user.id).to.eql(adminUserId);
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
              isAdmin: true,
              name: 'David Morgantini',
              username: 'dmorgantini',
              avatarUrl: 'https://www.tes.com/logo.svg',
            },
            {
              email: 'user@magic.com',
              id: normalUserOneId,
              isAdmin: false,
              name: 'User Magic',
              username: 'magic',
              templateId: 'eng-nodejs',
              avatarUrl: 'https://www.tes.com/logo.svg',
            },
            {
              email: 'user@dragon-riders.com',
              id: normalUserTwoId,
              isAdmin: false,
              name: 'User Dragon Rider',
              username: 'dragon-riders',
              avatarUrl: 'https://www.tes.com/logo.svg',
            },
          ];

          expect(getInitialState(res.text).users.users).to.deep.equal(expectedUsers);
        }));

    it('returns initial state with all evaluations', () => {
      let evaluationOneId;
      let evaluationTwoId;

      return insertEvaluation({ ...evaluation, _id: new ObjectID() }, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationOneId = String(insertedId);
        })
        .then(() =>
          insertEvaluation({ ...evaluation, _id: new ObjectID() }, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationTwoId = String(insertedId);
        })
        .then(() =>
          request(app)
            .get('/admin')
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then((res) => {
              const evaluations = getInitialState(res.text).evaluations.entities;
              const evaluationOne = evaluations[evaluationOneId];
              const evaluaitonTwo = evaluations[evaluationTwoId];

              expect(evaluationOne).to.have.property('createdDate');
              expect(evaluationOne.evaluationUrl).to.equal(`/evaluations/${evaluationOneId}`);
              expect(evaluationOne.feedbackUrl).to.equal(`/evaluations/${evaluationOneId}/feedback`);
              expect(evaluationOne.objectivesUrl).to.equal(`/evaluations/${evaluationOneId}/objectives`);
              expect(evaluationOne.id).to.equal(evaluationOneId);
              expect(evaluationOne.status).to.equal('NEW');
              expect(evaluationOne.template.name).to.equal('Node JS Dev');
              expect(evaluationOne.view).to.equal('ADMIN');

              expect(evaluaitonTwo.id).to.equal(evaluationTwoId);
            })));
    });
  });
});
