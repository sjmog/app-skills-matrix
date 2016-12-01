const test = require('tape');
const request = require('supertest');

const app = require('../backend');

test.onFinish(() => process.exit(0));

test('Redirect to github', (assert) => {
  assert.plan(1);
  request(app)
    .get('/auth/github')
    .expect(302)
    .end(function(err, res) {
      if (err) throw err;
      assert.error(err, 'No error');
      assert.end()
    })
});