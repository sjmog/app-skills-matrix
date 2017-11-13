import { expect } from 'chai';
import * as R from 'ramda';

import evaluation, { newEvaluation } from '../../backend/models/evaluations/evaluation';
import user from '../../backend/models/users/user';
import template from '../../backend/models/matrices/template';
import skills from '../../backend/models/matrices/skills';
import fixtureEvaluations from '../fixtures/evaluations';
import fixtureUsers from '../fixtures/users';
import fixtureSkills from '../fixtures/skills';
import fixtureTemplates from '../fixtures/templates';

const { dmorgantini } = fixtureUsers;
const [expectedInitialEvaluation, completedEvaluation, expectedMergedEvaluation] = fixtureEvaluations;

const testUser = user({ _id: dmorgantini._id.toString(), name: dmorgantini.name, username: dmorgantini.username, email: dmorgantini.email, mentorId: '123', lineManagerId: '123', templateId: '123', avatarUrl: 'abc' });
const testTemplate = template(fixtureTemplates[0] as any);
const testSkills = skills(fixtureSkills);

describe('new evaluation', () => {
  it('creates a new evaluation for a user', () => {
    const created = newEvaluation(testTemplate, testUser, testSkills, new Date(Date.parse('5 jan 2013')));
    expect(R.omit(['createdDate', '_id'], created.dataModel())).to.deep.equal(R.omit(['createdDate', '_id'], expectedInitialEvaluation));
  });
});

describe('second evaluation', () => {
  it('creates a new evaluation for a user', () => {
    const newEval = newEvaluation(testTemplate, testUser, testSkills, new Date(Date.parse('5 jan 2013')));
    const mergedEvaluation = newEval.mergePreviousEvaluation(evaluation(completedEvaluation));
    expect(R.omit(['createdDate', '_id'], mergedEvaluation.dataModel())).to.deep.equal(R.omit(['createdDate', '_id'], expectedMergedEvaluation));
  });
});
