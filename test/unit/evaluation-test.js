const { expect } = require('chai');

const { newEvaluation } = require('../../backend/models/evaluations/evaluation');
const evaluation = require('../../backend/models/evaluations/evaluation');
const user = require('../../backend/models/users/user');
const template = require('../../backend/models/matrices/template');
const skills = require('../../backend/models/matrices/skills');
const fixtureEvaluations = require('../fixtures/evaluations');
const fixtureSkills = require('../fixtures/skills');
const fixtureTemplates = require('../fixtures/templates');

const [expectedInitialEvaluation, completedEvaluation, expectedMergedEvaluation] = fixtureEvaluations;

const testUser = user({ _id: 'user_id', name: 'Jake', email: 'jake@hello.com' });
const testTemplate = template(fixtureTemplates[0]);
const testSkills = skills(fixtureSkills);

describe('new evaluation', () => {
  it('creates a new evaluation for a user', () => {
    const created = newEvaluation(testTemplate, testUser, testSkills, 'new Date()');
    expect(created.dataModel).to.deep.equal(expectedInitialEvaluation);
  });
});

describe('second evaluation', () => {
  it('handles no changes to the template', () => {
    const newEval = newEvaluation(testTemplate, testUser, testSkills, 'new Date()');
    const mergedEvaluation = newEval.mergePreviousEvaluation(evaluation(completedEvaluation));
    expect(mergedEvaluation.dataModel).to.deep.equal(expectedMergedEvaluation);
  });
});
