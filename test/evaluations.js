const request = require('supertest');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulateUsers, users, assignMentor, evaluations, insertTemplate, clearDb, insertSkill, insertEvaluation, getEvaluation, getAllActions } = require('./helpers');
const { sign, cookieName } = require('../backend/models/auth');
const { STATUS } = require('../backend/models/evaluations/evaluation');
const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = STATUS;
const templateData = require('./fixtures/templates');
const skills = require('./fixtures/skills');
const [evaluation] = require('./fixtures/evaluations');

const prefix = '/skillz';

let adminToken, normalUserOneToken, normalUserTwoToken;
let adminUserId, normalUserOneId, normalUserTwoId;

let evaluationId;

describe('evaluations', () => {

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

  describe('GET /evaluation/:evaluationId', () => {
    it('allows a user to retrieve their evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          expect(body.user.id).to.equal(String(normalUserOneId));
          expect(body.template.name).to.equal('Node JS Dev');
          expect(body.skillGroups[1]).to.not.be.undefined;
          expect(body.skills[1]).to.not.be.undefined;
        }));

    it('allows a mentor to view the evaluation of their mentee', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.user.id).to.equal(String(normalUserOneId));
              expect(body.template.name).to.equal('Node JS Dev');
              expect(body.skillGroups[1]).to.not.be.undefined;
              expect(body.skills[1]).to.not.be.undefined;
            })));

    it(`prevents a user that is not the subject, nor the subjects mentor, from viewing an evaluation`, () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    const errorCases = [
      () => ({
        desc: 'no evaluation',
        token: normalUserOneToken,
        evaluationId: 'noMatchingId',
        expect: 404,
      }),
    ];

    errorCases.forEach((test) =>
      it(`handles error case:${test().desc}`, () =>
        request(app)
          .get(`${prefix}/evaluations/${test().evaluationId}`)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)))
  });

  describe('POST /evaluations/:evaluationId { action: subjectUpdateSkillStatus }', () => {
    it('allows a user to update the status of a skill for a new evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204)
        )
        .then(() => getEvaluation(evaluationId))
        .then(({ skills }) => {
          expect(skills[0].status).to.deep.equal({ previous: null, current: 'ATTAINED' });
        }));

    it('adds feedback when a skill is set to FEEDBACK', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'FEEDBACK'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204)
        )
        .then(() => getAllActions())
        .then(([action]) => {
          expect(action).to.not.be.null;
          expect(action.type).to.equal('FEEDBACK')
          expect(action.evaluation.id).to.equal(evaluationId);
          expect(action.skill.id).to.equal(1);
        }));

    it('prevents updates by the subject of the evaluation if they have completed their self-evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents updates by the subject of an evaluation if the status is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents updates by the subject of the evaluation if the evaluation has been reviewed by their mentor', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents a user that is not the subject, from updating a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('returns not found if an attempt is made to update an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({
          action: 'subjectUpdateSkillStatus',
          skillGroupId: 0,
          skillId: 1,
          status: 'ATTAINED'
        })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404));
  });

  describe('POST /evaluations/:evaluationId { action: mentorUpdateSkillStatus }', () => {

    it('allows a mentor to update a skill for their mentee if they have already self-evaluated', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(204)
        )
        .then(() => getEvaluation(evaluationId))
        .then(({ skills }) => {
          expect(skills[0].status).to.deep.equal({ previous: null, current: 'ATTAINED' });
        })
    );

    it('prevents updates by a mentor if the status of an evaluation is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));


    it('prevents updates by a mentor if they have already completed their review of an evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents updates by a mentor if the evaluation has not been completed by their mentee', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW  }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents a user that is not the subject, nor the mentor of the subject, from updating a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('returns not found if an attempt is made to update an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({
          action: 'mentorUpdateSkillStatus',
          skillGroupId: 0,
          skillId: 1,
          status: 'ATTAINED'
        })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404));
  });

  describe('POST /evaluations/:evaluationId { action: complete }', () => {
    it('allows a user to complete their own evaluation when it is new', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.deep.equal({ status: SELF_EVALUATION_COMPLETE })
            })
            .then(() => evaluations.findOne({ _id: evaluationId }))
            .then((completedApplication) => {
              expect(completedApplication.status).to.equal(SELF_EVALUATION_COMPLETE);
            })
        ));

    it('allows a mentor to complete a review of an evaluation for their mentee', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body).to.deep.equal({ status: MENTOR_REVIEW_COMPLETE })
        })
        .then(() => evaluations.findOne({ _id: evaluationId }))
        .then((completedApplication) => {
          expect(completedApplication.status).to.equal(MENTOR_REVIEW_COMPLETE);
        }));

    it('prevents the subject of an evaluation from completing their evaluation if it is not new', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents the subject of an evaluation from completing their evaluation if the status is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents a mentor from completing a review for an evaluation if the status is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents the subject of an evaluation from completing their evaluation after a mentor review', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents a mentor from completing a review for an evaluation they have alraedy reviewed', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents mentor from completing a review of an evaluation before their mentee has self-evaluated', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW  }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents a user that is not the subject of the evaluation, nor the subjects mentor, from completing an evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('returns not found if a request is made to complete an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({ action: 'complete' })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404))
  })
});

