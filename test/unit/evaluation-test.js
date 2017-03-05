const { expect } = require('chai');

const { newEvaluation } = require('../../backend/models/evaluations/evaluation');
const user = require('../../backend/models/users/user');
const template = require('../../backend/models/matrices/template');
const skills = require('../../backend/models/matrices/skills');
const fixtureEvaluations = require('../fixtures/evaluations');
const fixtureSkills = require('../fixtures/skills');
const fixtureTemplates = require('../fixtures/templates');

const expectedInitialEvaluation = fixtureEvaluations[0];

const testUser = user({ _id: 'user_id', name: 'Jake', email: 'jake@hello.com' });
const testTemplate = template(fixtureTemplates[0]);
const testSkills = skills(fixtureSkills);

describe('new evaluation', () => {
  it('should create a new evaluation for a user', () => {
    const created = newEvaluation(testTemplate, testUser, testSkills, "new Date()");
    delete created._id;
    expect(created).to.deep.equal(expectedInitialEvaluation);
  });
});
