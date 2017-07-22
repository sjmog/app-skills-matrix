import request from 'supertest';
import { expect } from 'chai';
import Promise from 'bluebird';

import app from '../backend';
import { sign, cookieName } from '../backend/models/auth';
import { users, templates, skills, prepopulateUsers, insertTemplate, insertSkill, clearDb } from './helpers';
import templateFixture from './fixtures/templates.json';
import skillsFixture from './fixtures/skills.json';

const [sampleTemplate] = templateFixture;
const [sampleSkill] = skillsFixture;

const prefix = '/skillz/matrices';

let adminToken;
let normalUserToken;

describe('matrices', () => {
  beforeEach(() =>
    clearDb()
      .then(prepopulateUsers)
      .then(() =>
        Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
          .then(([adminUser, normalUser]) => {
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserToken = sign({ username: normalUser.username, id: normalUser._id });
          })));

  describe('GET /matrices/template', () => {
    it('gets the template by id', () => insertTemplate(Object.assign({}, sampleTemplate))
      .then(() =>
        request(app)
          .get(`${prefix}/templates/${sampleTemplate.id}`)
          .set('Cookie', `${cookieName}=${adminToken}`)
          .expect(200)
          .then(({ body }) => {
            expect(body.name).to.equal('Node JS Dev');
            expect(body.skillGroups[0].category).to.equal('Dragon Slaying');
          })));

    const errorCases =
      [
        () => ({
          desc: 'not authorized',
          token: normalUserToken,
          id: sampleTemplate.id,
          expect: 403,
        }),
        () => ({
          desc: 'no template',
          token: adminToken,
          id: 'lolz-lolz',
          expect: 404,
        }),
      ];

    errorCases.forEach(test =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .get(`${prefix}/templates/${test().id}`)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });

  describe('POST /matrices/templates', () => {
    it('permits saving of new templates by admin users', () =>
      request(app)
        .post(`${prefix}/templates`)
        .send({ action: 'save', template: JSON.stringify(sampleTemplate) })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(() => templates.findOne({ id: 'eng-nodejs' }))
        .then((newTemplate) => {
          expect(newTemplate.name).to.equal('Node JS Dev');
          expect(newTemplate.skillGroups[0].category).to.equal('Dragon Slaying');
        }));

    it('updates an existing template with the same id', () =>
      insertTemplate(Object.assign({}, sampleTemplate))
        .then(() =>
          request(app)
            .post(`${prefix}/templates`)
            .send({
              action: 'save',
              template: JSON.stringify(Object.assign({}, sampleTemplate, { name: 'new name', skillGroups: [] })),
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(201))
        .then(() => templates.findOne({ id: 'eng-nodejs' }))
        .then((updatedTemplate) => {
          expect(updatedTemplate.name).to.deep.equal('new name');
          expect(updatedTemplate.skillGroups.length).to.equal(0);
        }));

    const errorCases =
      [
        () => ({
          desc: 'not authorized',
          token: normalUserToken,
          body: { action: 'create', template: {} },
          expect: 403,
        }),
        () => ({
          desc: 'bad action',
          token: adminToken,
          body: { action: 'foo', template: {} },
          expect: 400,
        }),
      ];

    errorCases.forEach(test =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/templates`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });

  describe('GET matrices/skills', () => {
    it('gets all the skills', () =>
      Promise.map(skillsFixture, insertSkill)
        .then(() =>
          request(app)
            .get(`${prefix}/skills`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then((res) => {
              // dear future me, I'm sorry.
              expect(res.body[1].name).to.equal(skillsFixture[0].name);
              expect(res.body[2].name).to.equal(skillsFixture[1].name);
              expect(res.body[12].name).to.equal(skillsFixture[11].name);
            })));
  });

  describe('POST matrices/skills', () => {
    it('permits saving of a new skill by admin users', () =>
      request(app)
        .post(`${prefix}/skills`)
        .send({
          action: 'save',
          skill: JSON.stringify(sampleSkill),
        })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(() => skills.findOne({ id: 1 }))
        .then((newSkill) => {
          expect(newSkill.id).to.equal(1);
          expect(newSkill.name).to.equal('Dragon Feeding');
        }));

    it('permits saving of a list of new skills by admin users', () =>
      request(app)
        .post(`${prefix}/skills`)
        .send({
          action: 'save',
          skill: JSON.stringify(skillsFixture),
        })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(() => skills.find({}))
        .then(savedSkills => savedSkills.toArray())
        .then((savedSkills) => {
          expect(savedSkills.length).to.equal(skillsFixture.length);
        }));

    it('updates an existing skill with the same id', () =>
      insertSkill(Object.assign({}, sampleSkill))
        .then(() =>
          request(app)
            .post(`${prefix}/skills`)
            .send({
              action: 'save',
              skill: JSON.stringify(Object.assign({}, sampleSkill, { name: 'new name', questions: [] })),
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(201))
        .then(() => skills.findOne({ id: 1 }))
        .then((updatedSkill) => {
          expect(updatedSkill.id).to.equal(1);
          expect(updatedSkill.name).to.deep.equal('new name');
          expect(updatedSkill.questions.length).to.equal(0);
        }));

    const errorCases =
      [
        () => ({
          desc: 'not authorized',
          token: normalUserToken,
          body: { action: 'create', skill: {} },
          expect: 403,
        }),
        () => ({
          desc: 'bad action',
          token: adminToken,
          body: { action: 'foo', skill: {} },
          expect: 400,
        }),
      ];

    errorCases.forEach(test =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/skills`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });
});
