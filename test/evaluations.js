const request = require('supertest');
const { expect } = require('chai');
const R = require('ramda');

const app = require('../backend');

const {
  prepopulateUsers,
  users,
  assignMentor,
  evaluations,
  insertTemplate,
  clearDb,
  insertSkill,
  insertEvaluation,
  getEvaluation,
  getAllActions,
  skillStatus,
  insertAction,
} = require('./helpers');
const { sign, cookieName } = require('../backend/models/auth');
const { STATUS } = require('../backend/models/evaluations/evaluation');

const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = STATUS;
const templateData = require('./fixtures/templates');
const skills = require('./fixtures/skills');
const [evaluation] = require('./fixtures/evaluations');
const [action] = require('./fixtures/actions');

const prefix = '/skillz';

let adminToken;
let normalUserOneToken;
let normalUserTwoToken;
let adminUserId;
let normalUserOneId;
let normalUserTwoId;

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
          users.findOne({ email: 'user@dragon-riders.com' }),
        ])
          .then(([adminUser, normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ username: normalUserOne.username, id: normalUserOne._id });
            normalUserTwoToken = sign({ username: normalUserTwo.username, id: normalUserTwo._id });
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserOneId = String(normalUserOne._id);
            normalUserTwoId = String(normalUserTwo._id);
            adminUserId = String(adminUser._id);
          })));

  describe('GET /evaluation/:evaluationId', () => {
    it('allows a user to retrieve their evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body.subject.id).to.equal(String(normalUserOneId));
          expect(body.template.name).to.equal('Node JS Dev');
          expect(body.skillGroups[1]).to.not.be.undefined;
          expect(body.skills[evaluationId + 1]).to.not.be.undefined;
          expect(body.view).to.equal('SUBJECT');
        }));

    it('allows a mentor to view the evaluation of their mentee', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.subject.id).to.equal(String(normalUserOneId));
              expect(body.template.name).to.equal('Node JS Dev');
              expect(body.skillGroups[1]).to.not.be.undefined;
              expect(body.skills[evaluationId + 1]).to.not.be.undefined;
              expect(body.view).to.equal('MENTOR');
            })));

    it('allows an admin user to view all evaluations', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.subject.id).to.equal(String(normalUserOneId));
              expect(body.template.name).to.equal('Node JS Dev');
              expect(body.skillGroups[1]).to.not.be.undefined;
              expect(body.skills[evaluationId + 1]).to.not.be.undefined;
              expect(body.view).to.equal('ADMIN');
            })));

    it('sets evaluation view to subject if user is subject and admin', () =>
      insertEvaluation(evaluation, adminUserId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.view).to.equal('SUBJECT');
            })));

    it('sets evaluation view to mentor if user is a mentor and they are an admin', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, adminUserId))
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.view).to.equal('MENTOR');
            })));

    it('prevents a user that is not the subject, the subjects mentor, nor an admin user, from viewing an evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
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

    errorCases.forEach(test =>
      it(`handles error case:${test().desc}`, () =>
        request(app)
          .get(`${prefix}/evaluations/${test().evaluationId}`)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });

  describe('POST /evaluations/:evaluationId { action: subjectUpdateSkillStatus }', () => {
    it('allows a user to update the status of a skill for a new evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 5,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204))
        .then(() => getEvaluation(evaluationId))
        .then(({ skills: evalSkills }) => {
          expect(skillStatus(evalSkills, 5)).to.deep.equal({ previous: null, current: 'ATTAINED' });
        }));

    it('adds action when a skill is set to FEEDBACK', () =>
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
              status: 'FEEDBACK',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204))
        .then(() => getAllActions())
        .then(([firstAction]) => {
          expect(firstAction).to.not.be.undefined;
          expect(firstAction.type).to.equal('FEEDBACK');
          expect(firstAction.evaluation.id).to.equal(evaluationId);
          expect(firstAction.skill.id).to.equal(1);
        }));

    it('adds action when a skill is set to OBJECTIVE', () =>
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
              status: 'OBJECTIVE',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204))
        .then(() => getAllActions())
        .then(([firstAction]) => {
          expect(firstAction).to.not.be.undefined;
          expect(firstAction.type).to.equal('OBJECTIVE');
          expect(firstAction.evaluation.id).to.equal(evaluationId);
          expect(firstAction.skill.id).to.equal(1);
        }));

    it('removes action when a skill was previously FEEDBACK', () =>
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
              status: 'FEEDBACK',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204))
        .then(() => getAllActions())
        .then(([firstAction]) => {
          expect(firstAction).to.be.undefined;
        }));

    it('prevents updates by the subject of the evaluation if they have completed their self-evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents updates by the subject of an evaluation if the status is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents updates by the subject of the evaluation if the evaluation has been reviewed by their mentor', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents a user that is not the subject, from updating a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
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
          status: 'ATTAINED',
        })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404));
  });

  describe('POST /evaluations/:evaluationId { action: mentorUpdateSkillStatus }', () => {
    it('allows a mentor to update a skill for their mentee if they have already self-evaluated', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 5,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(204))
        .then(() => getEvaluation(evaluationId))
        .then(({ skills: evalSkills }) => {
          expect(skillStatus(evalSkills, 5)).to.deep.equal({ previous: null, current: 'ATTAINED' });
        }));

    it('adds action when status of a skill is updated to an action (FEEDBACK/OBJECTIVE)', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'FEEDBACK',
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(204))
        .then(() => getAllActions())
        .then(([firstAction]) => {
          expect(firstAction).to.not.be.undefined;
          expect(firstAction.type).to.equal('FEEDBACK');
          expect(firstAction.evaluation.id).to.equal(evaluationId);
          expect(firstAction.skill.id).to.equal(1);
          expect(firstAction.user.id).to.equal(normalUserOneId);
          expect(firstAction.user.name).to.equal('User Magic');
          expect(firstAction.user.mentorId).to.equal(normalUserTwoId);
        }));


    it('prevents updates by a mentor if the status of an evaluation is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));


    it('prevents updates by a mentor if they have already completed their review of an evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents updates by a mentor if the evaluation has not been completed by their mentee', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents a user that is not the subject, nor the mentor of the subject, from updating a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
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
          status: 'ATTAINED',
        })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404));
  });

  describe('POST /evaluations/:evaluationId { action: adminUpdateSkillStatus }', () => {
    it('allows an admin user to update a skill for any evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 5,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(204))
        .then(() => getEvaluation(evaluationId))
        .then(({ skills: evalSkills }) => {
          expect(skillStatus(evalSkills, 5)).to.deep.equal({ previous: null, current: 'ATTAINED' });
        }));

    it('adds action when a status of a skill is updated to an action (FEEDBACK/OBJECTIVE)', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'FEEDBACK',
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(204))
        .then(() => getAllActions())
        .then(([firstAction]) => {
          expect(firstAction).to.not.be.undefined;
          expect(firstAction.type).to.equal('FEEDBACK');
          expect(firstAction.evaluation.id).to.equal(evaluationId);
          expect(firstAction.skill.id).to.equal(1);
          expect(firstAction.user.id).to.equal(normalUserOneId);
          expect(firstAction.user.name).to.equal('User Magic');
          expect(firstAction.user.mentorId).to.equal(normalUserTwoId);
        }));

    it('replaces existing action when status of a skill is updated from one action type to another', () => {
      const originalSkillStatus = 'FEEDBACK';
      const postUpdateSkillStatus = 'OBJECTIVE';
      const skillId = R.path(['skills', 0, 'id'])(evaluation);
      const skillLens = R.lensPath(['skills', 0, 'status', 'current']);
      const originalEval = R.set(skillLens, originalSkillStatus)(evaluation);

      return insertEvaluation(Object.assign({}, originalEval, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() => {
          const originalAction = Object.assign({}, action,
            { type: originalSkillStatus, evaluation: { id: evaluationId }, skill: { id: skillId } });

          return insertAction(normalUserOneId)(originalAction);
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId,
              status: postUpdateSkillStatus,
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(204))
        .then(() => getAllActions())
        .then((actions) => {
          expect(actions.length).to.equal(1);
          const [firstAction] = actions;
          expect(firstAction.type).to.equal(postUpdateSkillStatus);
          expect(firstAction.evaluation.id).to.equal(evaluationId);
          expect(firstAction.skill.id).to.equal(skillId);
          expect(firstAction.user.id).to.equal(normalUserOneId);
        });
    });

    it('prevents users from updating the status of a skill via the admin handler if they are not an admin user', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('returns not found if an attempt is made to update an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({
          action: 'mentorUpdateSkillStatus',
          skillGroupId: 0,
          skillId: 1,
          status: 'ATTAINED',
        })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(404));

    it('prevents a user that is not logged in from updating the status of a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED',
            })
            .expect(401)));

    it('returns bad request if attempt is made to update status of a skill that does not exist', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1111111,
              status: 'ATTAINED',
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(400)));
  });

  describe('POST /evaluations/:evaluationId { action: complete }', () => {
    it('allows a user to complete their own evaluation when it is new', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.deep.equal({ status: SELF_EVALUATION_COMPLETE });
            })
            .then(() => evaluations.findOne({ _id: evaluationId }))
            .then((completedApplication) => {
              expect(completedApplication.status).to.equal(SELF_EVALUATION_COMPLETE);
            })));

    it('allows a mentor to complete a review of an evaluation for their mentee', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body).to.deep.equal({ status: MENTOR_REVIEW_COMPLETE });
        })
        .then(() => evaluations.findOne({ _id: evaluationId }))
        .then((completedApplication) => {
          expect(completedApplication.status).to.equal(MENTOR_REVIEW_COMPLETE);
        }));

    it('prevents the subject of an evaluation from completing their evaluation if it is not new', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
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
          evaluationId = insertedId;
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
          evaluationId = insertedId;
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
          evaluationId = insertedId;
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
          evaluationId = insertedId;
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents mentor from completing a review of an evaluation before their mentee has self-evaluated', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId;
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
          evaluationId = insertedId;
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
        .expect(404));
  });
});

