const request = require('supertest');
const { expect } = require('chai');
const cheerio = require('cheerio');

const app = require('../backend');
const { prepopulateUsers, users, evaluations, insertTemplate, assignTemplate, clearDb, insertSkill, insertEvaluation, assignMentor } = require('./helpers');
const { sign, cookieName } = require('../backend/models/auth');
const [template] = require('./fixtures/templates');
const skills = require('./fixtures/skills');
const [evaluation] = require('./fixtures/evaluations');

let adminToken, normalUserOneToken, normalUserTwoToken;
let adminUserId, normalUserOneId, normalUserTwoId;

const getInitialState = (str) => {
  const $ = cheerio.load(str);
  const scriptTagContents = $('script').get()[0].children[0].data;

  return JSON.parse(scriptTagContents.match(/REDUX_STATE=(.*)/)[0].substr(12));
};

describe('Initial client state', () => {

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(template))
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

  describe('GET / (client state)', () => {
    it('returns HTML with a script tag containing initial state', () =>
      request(app)
        .get('/')
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(200)
        .then((res) => {
          const expectedState = {
            dashboard: {
              evaluations: [],
              menteeEvaluations: [],
              mentor: null,
              template: null,
              user: {
                email: 'user@magic.com',
                name: 'User Magic'
              }
            },
          };

          expect(getInitialState(res.text)).to.deep.equal(expectedState);
        })
    );

    it('returns initial state with evaluations', () =>
      insertEvaluation(Object.assign({}, evaluation, { user: { id: String(normalUserOneId) } }))
        .then(({ insertedId: evaluationId }) =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {

              const expectedEvaluations = [
                {
                  id: String(evaluationId),
                  status: 'NEW',
                  templateName: 'Node JS Dev',
                  url: `undefined/#/evaluations/${String(evaluationId)}`
                }
              ];

              expect(getInitialState(res.text).dashboard.evaluations).to.deep.equal(expectedEvaluations);
            })
        )
    );

    it('returns initial state with mentee evaluations', () =>
      Promise.all([
          assignMentor(normalUserTwoId, normalUserOneId),
          insertEvaluation(Object.assign({}, evaluation, { user: { id: String(normalUserTwoId) } })),
        ])
        .then(([ res, { insertedId: menteeEvaluationId }]) =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {

              const expectedMenteeEvaluations = [
                {
                  name: 'User Dragon Rider',
                  evaluations: [
                    {
                      id: String(menteeEvaluationId),
                      status: 'NEW',
                      templateName: 'Node JS Dev',
                      url: `undefined/#/evaluations/${String(menteeEvaluationId)}`
                    }
                  ]
                }
              ];

              expect(getInitialState(res.text).dashboard.menteeEvaluations).to.deep.equal(expectedMenteeEvaluations);
            })
        )
    );

    it('returns initial state with mentor', () =>
      assignMentor(normalUserOneId, adminUserId)
        .then(({ insertedId: evaluationId }) =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {

              const expectedMentor = {
                email: 'dmorgantini@gmail.com',
                name: 'David Morgantini'
              };

              expect(getInitialState(res.text).dashboard.mentor).to.deep.equal(expectedMentor);
            })
        )
    );

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
                name: 'Node JS Dev'
              };

              expect(getInitialState(res.text).dashboard.template).to.deep.equal(expectedTemplate);
            })
        )
    );

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
                mentorId: String(adminUserId),
                name: 'User Magic'
              };

              expect(getInitialState(res.text).dashboard.user).to.deep.equal(expectedUser);
            })
        )
    );
  })
});
