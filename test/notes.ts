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
  insertNote,
  getNoteById,
  addNoteIdsToSkill,
} = helpers;


const prefix = '/skillz';

let adminToken;
let normalUserOneToken;
let normalUserTwoToken;
let adminUserId;
let normalUserOneId;
let normalUserTwoId;

let evaluationId;
let noteId;

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
          }))
      .then(() => {
        evaluationId = null;
        noteId = null;
      }));

  describe('POST /evaluations/:evaluationId { action: addNote }', () => {
    const validAddNoteSubmission = {
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
              .send(validAddNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(200))
          .then(() => getNotes(normalUserOneId, 5))
          .then((notes) => {
            expect(notes.length).to.equal(1);
            const { userId, skillId, note, createdDate, deleted } = notes[0];
            expect(userId).to.equal(normalUserOneId);
            expect(skillId).to.equal(5);
            expect(note).to.equal('I have slain over 200 of those pesky fire breathers');
            expect(moment(createdDate).isValid()).to.equal(true);
            expect(deleted).to.equal(false);
          }));

      it('adds note id to an empty list of notes for a skill', () =>
        insertEvaluation(addNoteIdsToSkill([], 5, evaluation), normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validAddNoteSubmission)
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

      it('adds note id to a list of notes for a skill', () =>
        insertEvaluation(addNoteIdsToSkill(['existing_note'], 5, evaluation), normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validAddNoteSubmission)
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(200))
          .then(() => getNotes(normalUserOneId, 5))
          .then((notes) => {
            const { _id: noteId } = notes[0];

            return getEvaluation(evaluationId)
              .then(({ skills: evalSkills }) => getSkillNotes(evalSkills, 5))
              .then((notesForSkill) => {
                expect(notesForSkill).to.eql(['existing_note', String(noteId)]);
              });
          }));

      it('adds list of notes with newly added note when a skill has no notes field', () => {
        const skill = R.find(R.propEq('id', 5), evaluation.skills);
        expect(skill).to.not.have.property('notes');

        return insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validAddNoteSubmission)
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
          });
      });

      it('returns success status code and note data', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validAddNoteSubmission)
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
              .send(validAddNoteSubmission)
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
              .send(validAddNoteSubmission)
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
              .send(validAddNoteSubmission)
              .set('Cookie', `${cookieName}=${adminToken}`)
              .expect(200)));
    });

    describe('failure', () => {
      it('returns not found when evaluation does not exist', () =>
        request(app)
          .post(`${prefix}/evaluations/${new ObjectID()}`)
          .send(validAddNoteSubmission)
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
              .send(validAddNoteSubmission)
              .expect(401)));

      it('returns forbidden when user is not subject, mentor nor admin', () =>
        insertEvaluation(evaluation, normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validAddNoteSubmission)
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
              .send(R.omit(['note'], validAddNoteSubmission))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(400)));

    });
  });

  describe('POST /evaluations/:evaluationId { action: deleteNote }', () => {
    const validNoteDeletion = (skillId, noteId) => ({
      action: 'deleteNote',
      skillId,
      noteId,
    });

    describe('success', () => {
      it('removes a note from the list of notes for a skill', () =>
        insertNote({ note: 'This is a note', skillId: 5, userId: normalUserOneId })
          .then(({ insertedId }) => {
            noteId = insertedId;
          })
          .then(() => insertEvaluation(addNoteIdsToSkill([noteId], 5, evaluation), normalUserOneId))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(5, noteId))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(204))
          .then(() => getEvaluation(evaluationId))
          .then(({ skills: evalSkills }) => getSkillNotes(evalSkills, 5))
          .then((notesForSkill) => {
            expect(notesForSkill).to.eql([]);
          }));

      it('sets a deleted flag to true for the note', () =>
        insertNote({ note: 'This is a note', skillId: 5, userId: normalUserOneId })
          .then(({ insertedId }) => {
            noteId = insertedId;
          })
          .then(() => insertEvaluation(addNoteIdsToSkill([noteId], 5, evaluation), normalUserOneId))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(5, noteId))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(204))
          .then(() => getNoteById(noteId))
          .then(note => expect(note.deleted).to.equal(true)));

      it('only removes the note set for deletion from the list of notes for a skill', () => {
        let noteOneId;
        let noteTwoId;

        return Promise.all([
          insertNote({ note: 'This is a note', skillId: 5, userId: normalUserOneId }),
          insertNote({ note: 'This is another note', skillId: 5, userId: normalUserOneId }),
        ])
          .then(([{ insertedId: noteOneInsertedId }, { insertedId: noteTwoInsertedId }]) => {
            noteOneId = noteOneInsertedId;
            noteTwoId = noteTwoInsertedId;
          })
          .then(() => insertEvaluation(addNoteIdsToSkill([noteOneId, noteTwoId], 5, evaluation), normalUserOneId))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(5, noteOneId))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(204))
          .then(() => getEvaluation(evaluationId))
          .then(({ skills: evalSkills }) => getSkillNotes(evalSkills, 5))
          .then((notesForSkill) => {
            expect(notesForSkill).to.eql([String(noteTwoId)]);
          });
      });

      it('sets a deleted flag to true when skill has no notes field', () =>
        insertNote({ note: 'This is a note', skillId: 5, userId: normalUserOneId })
          .then(({ insertedId }) => {
            noteId = insertedId;
          })
          .then(() => {
            const skill = R.find(R.propEq('id', 5), evaluation.skills);
            return expect(skill).to.not.have.property('notes');
          })
          .then(() => insertEvaluation(evaluation, normalUserOneId))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(5, noteId))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(204))
          .then(() => getNoteById(noteId))
          .then(note => expect(note.deleted).to.equal(true)));

      it('sets a deleted flag to true for the note when it is not in the list of notes for a skill', () =>
        insertNote({ note: 'This is a note', skillId: 5, userId: normalUserOneId })
          .then(({ insertedId }) => {
            noteId = insertedId;
          })
          .then(() => insertEvaluation(addNoteIdsToSkill([], 5, evaluation), normalUserOneId))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(5, noteId))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(204))
          .then(() => getNoteById(noteId))
          .then(note => expect(note.deleted).to.equal(true)));
    });

    describe('failure', () => {
      it('note cannot be deleted by someone that did not add it', () =>
        insertNote({ note: 'This is a note', skillId: 5, userId: normalUserOneId })
          .then(({ insertedId }) => {
            noteId = insertedId;
          })
          .then(() => insertEvaluation(addNoteIdsToSkill([noteId], 5, evaluation), normalUserOneId))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(5, noteId))
              .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
              .expect(403)));

      it('returns not found when an evaluation does not exist', () =>
        insertNote({ note: 'This is a note', skillId: 5, userId: normalUserOneId })
          .then(({ insertedId }) => {
            noteId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${new ObjectID()}`)
              .send(validNoteDeletion(5, noteId))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(404)));

      it('returns unauthorised when a user is not logged in', () =>
        request(app)
          .post(`${prefix}/evaluations/${new ObjectID()}`)
          .send(validNoteDeletion(5, 'note_id'))
          .expect(401));

      it('returns a bad request when an invalid request is made', () =>
        request(app)
          .post(`${prefix}/evaluations/${new ObjectID()}`)
          .send({ action: 'deleteNote', invalid: 'data' })
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(400));

      it('returns not found when a note does not exist', () => {
        const idOfNoteMissingFromDb = new ObjectID();
        return insertEvaluation(addNoteIdsToSkill([idOfNoteMissingFromDb], 5, evaluation), normalUserOneId)
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(5, idOfNoteMissingFromDb))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(404));
      });

      it('returns not found when a skill does not exist', () =>
        insertNote({ note: 'This is a note', skillId: 101010101, userId: normalUserOneId })
          .then(({ insertedId }) => {
            noteId = insertedId;
          })
          .then(() => insertEvaluation(evaluation, normalUserOneId))
          .then(({ insertedId }) => {
            evaluationId = insertedId;
          })
          .then(() =>
            request(app)
              .post(`${prefix}/evaluations/${evaluationId}`)
              .send(validNoteDeletion(101010101, noteId))
              .set('Cookie', `${cookieName}=${normalUserOneToken}`)
              .expect(404)));
    });
  });
});

