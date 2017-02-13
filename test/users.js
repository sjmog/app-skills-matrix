const request = require('supertest');
const { expect } = require('chai');

const app = require('../backend');
const { prepopulate, skills, users } = require('./helpers/prepopulate');
const { sign, cookieName } = require('../backend/models/auth');

const prefix = '/skillz';

let adminToken;

beforeEach(() =>
  prepopulate()
    .then(() =>
      users.findOne({ email: 'dmorgantini@gmail.com' })
        .then((adminUser) => {
          adminToken = sign({ email: adminUser.email, id: adminUser._id });
        })));

describe('POST /users', () => {
  it('Admins can add a user', () =>
    request(app)
      .post(prefix + '/users')
      .send({ email: 'newuser@user.com', name: 'new name', action: 'create' })
      .set('Cookie', `${cookieName}=${adminToken}`)
      .expect(201)
      .then((res) => users.findOne({ email: res.body.email }))
      .then((newUser) => {
        expect(newUser.email).to.equal('newuser@user.com');
        expect(newUser.name).to.equal('new name');
      }));
});
