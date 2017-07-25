// @flow
import { expect } from 'chai';

import evaluation, { newEvaluation } from '../../backend/models/evaluations/evaluation';
import user from '../../backend/models/users/user';
import template from '../../backend/models/matrices/template';
import skills from '../../backend/models/matrices/skills';
import fixtureEvaluations from '../fixtures/evaluations.json';
import fixtureSkills from '../fixtures/skills.json';
import fixtureTemplates from '../fixtures/templates.json';

const [expectedInitialEvaluation, completedEvaluation, expectedMergedEvaluation] = fixtureEvaluations;

const testUser = user({ _id: 'user_id', name: 'Jake', username: 'Jake', email: 'jake@hello.com', mentorId: '123', templateId: '123', avatarUrl: 'abc' });
const testTemplate = template(fixtureTemplates[0]);
const testSkills = skills(fixtureSkills);

describe('new evaluation', () => {
  it('creates a new evaluation for a user', () => {
    const created = newEvaluation(testTemplate, testUser, testSkills, new Date(Date.parse('5 jan 2013')));
    expect(created.dataModel()).to.deep.equal(expectedInitialEvaluation);
  });
});

describe('second evaluation', () => {
  it('handles no changes to the template', () => {
    const newEval = newEvaluation(testTemplate, testUser, testSkills, new Date(Date.parse('5 jan 2013')));
    const mergedEvaluation = newEval.mergePreviousEvaluation(evaluation(completedEvaluation));
    expect(mergedEvaluation.dataModel()).to.deep.equal(expectedMergedEvaluation);
  });
});
