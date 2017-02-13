const request = require('supertest');

const app = require('../backend');

it('should redirect to github', () =>
  request(app)
    .get('/auth/github')
    .expect(302));
