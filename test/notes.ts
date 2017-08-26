import * as request from 'supertest';
import { expect } from 'chai';
import * as moment from 'moment';
import * as R from 'ramda';
import { ObjectID } from 'mongodb';

import app from '../backend/app';
import templateData from './fixtures/templates';
import skillsFixture from './fixtures/skills';
import evaluationsFixture from './fixtures/evaluations';
import actionsFixture from './fixtures/actions';
import auth from '../backend/models/auth';
import helpers from './helpers';

const { sign, cookieName } = auth;

const [evaluation] = evaluationsFixture;
const [action] = actionsFixture;
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
  getSkillNotes,
  getNotes,
} = helpers;


const prefix = '/skillz';

let adminToken;
let normalUserOneToken;
let normalUserTwoToken;
let adminUserId;
let normalUserOneId;
let normalUserTwoId;

let evaluationId;

describe('Notes', () => {
  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(templateData[0]))
      .then(() => skillsFixture.map(insertSkill))
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

  describe('POST /evaluations/:evaluationId { action: addNote }', () => {
    const validNoteSubmission = {
      action: 'addNote',
      skillId: 5,
      note: 'I have slain over 200 of those pesky fire breathers',
    };

    describe('success', () => {
      it('stores a note', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(200))
          .then(() => getNotes(normalUserOneId, 5))
          .then((notes) => {
            expect(notes.length).to.equal(1);
            const { userId, skillId, note, createdDate } = notes[0];
            expect(userId).to.equal(normalUserOneId);
            expect(skillId).to.equal(5);
            expect(note).to.equal('I have slain over 200 of those pesky fire breathers');
            expect(moment(createdDate).isValid()).to.equal(true);
          }));

      it('adds note id to the list of notes for a skill', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(200))
          .then(() => getNotes(normalUserOneId, 5))
          .then((notes) => {
            const { _id: noteId } = notes[0];

            return getEvaluation(evaluationId)
              .then(({ skills: evalSkills }) => getSkillNotes(evalSkills, 5))
              .then((notesForSkill) => {
                expect(notesForSkill).to.eql([String(noteId)]);
              });
          }));

      it('returns success status code and note data', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(200))
          .then(({ body: { id, userId, skillId, note, createdDate } }) => {
            expect(id).to.be.a('string').with.length.above(0);
            expect(userId).to.equal(normalUserOneId);
            expect(skillId).to.equal(5);
            expect(note).to.equal('I have slain over 200 of those pesky fire breathers');
            expect(moment(createdDate).isValid()).to.equal(true);
          }));

      it('subject of an evaluation can add a note', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(200)));

      it('mentor of subject can add a note', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() => assignMentor(normalUserOneId, normalUserTwoId))
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
              .expect(200)));

      it('admin can add a note', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .set('Cookie', `${cookieName}=${adminToken}`)
              .expect(200)));
    });

    describe('failure', () => {
      it('returns not found when evaluation does not exist', () =>
        request(app)
          .post(`${prefix}/evaluations/${new ObjectID()}`)
          .send(validNoteSubmission)
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(404));

      it('returns unauthorized when user is not logged in', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .expect(401)));

      it('returns forbidden when user is not subject, mentor nor admin', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
              .expect(403)));

      it('returns bad request when request is made to add note to skill that does not exist', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send({
                action: 'addNote',
                skillId: 1005,
                note: 'I have slain over 200 of those pesky fire breathers',
              })
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(400)));

      it('returns a bad request when an invalid request is made', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(R.omit(['note'], validNoteSubmission))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(400)));

    });
  });
});

