const request = require('supertest');
const { expect } = require('chai');

const app = require('../backend');
const { sign, cookieName } = require('../backend/models/auth');
const { users, templates, prepopulate, insertTemplate } = require('./helpers/prepopulate');

const prefix = '/skillz';

const sampleTemplate = {
  templateId: 1,
  name: 'Node.js',
  skillGroups: [
    {
      category: 'technicalSkill',
      level: 'novice',
      skills: [1,2]
    },
    {
      category: 'frontendDevelopment',
      level: 'novice',
      skills: [3,4]
    }
  ]
};

let adminToken, normalUserToken;
let adminUserId, normalUserId;

beforeEach(() =>
  prepopulate()
    .then(() =>
      Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
        .then(([adminUser, normalUser]) => {
          adminToken = sign({ email: adminUser.email, id: adminUser._id });
          normalUserToken = sign({ email: normalUser.email, id: normalUser._id });
          normalUserId = normalUser._id;
          adminUserId = adminUser._id;
        }))
    .then(() => templates.remove({}))
);

describe('POST /templates', () => {
  it('permits saving of new templates by admin users', () =>
    request(app)
      .post(`${prefix}/templates`)
      .send({  action: 'save', template: JSON.stringify(sampleTemplate) })
      .set('Cookie', `${cookieName}=${adminToken}`)
      .expect(201)
      .then((res) => templates.findOne({ templateId: 1 }))
      .then(newTemplate => {
        expect(newTemplate.templateId).to.equal(1);
        expect(newTemplate.name).to.equal('Node.js');
      })
  );

  it('overrides an existing template when the templateId provided already exists', () =>
    insertTemplate(Object.assign({}, sampleTemplate))
      .then(() =>
        request(app)
          .post(`${prefix}/templates`)
          .send({
            action: 'save',
            template: JSON.stringify(Object.assign({}, sampleTemplate, { name: 'New name', skillGroups: [] })) })
          .set('Cookie', `${cookieName}=${adminToken}`)
          .expect(201))
      .then((res) => templates.findOne({ templateId: 1 }))
      .then(newTemplate => {
        expect(newTemplate.templateId).to.equal(1);
        expect(newTemplate.name).to.deep.equal('New name');
        expect(newTemplate.skillGroups.length).to.equal(0);
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

  errorCases.forEach((test) =>
  it(`should handle error cases '${test().desc}'`, () =>
    request(app)
      .post(`${prefix}/templates`)
      .send(test().body)
      .set('Cookie', `${cookieName}=${test().token}`)
      .expect(test().expect)));
});
