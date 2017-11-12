import * as request from 'supertest';

import app from '../backend/app';

it('should redirect to github', () =>
  request(app)
    .get('/auth/github')
    .expect(302));
