const { expect } = require('chai');
const R = require('ramda');
const constructPaginatedView = require('../../frontend/modules/user/constructPaginatedView');

const evaluation = {
  template: {
    levels: ['Novice', 'Experienced Beginner', 'Knowledgeable'],
    categories: ['Software Design', 'Vision and Ownership'],
  },
  skillGroups: {
    '0': {
      id: 0,
      category: 'Vision and Ownership',
      level: 'Knowledgeable',
      skills: [
        2,
      ]
    },
    '1': {
      id: 1,
      category: 'Vision and Ownership',
      level: 'Experienced Beginner',
      skills: [
        10,
      ]
    },
    '2': {
      id: 2,
      category: 'Software Design',
      level: 'Experienced Beginner',
      skills: [
        13,
      ]
    },
    '15': {
      id: 15,
      category: 'Vision and Ownership',
      level: 'Novice',
      skills: [
        14,
      ]
    },
    '7': {
      id: 7,
      category: 'Software Design',
      level: 'Knowledgeable',
      skills: [
        15,
      ]
    },
    '20': {
      id: 20,
      category: 'Software Design',
      level: 'Novice',
      skills: [
        16,
      ]
    },
  },
  skills: {
    '2': {
      id: 2,
      name: 'Name of skill 2',
      criteria: 'Crtieria of skill 2',
      questions: [],
    },
    '10': {
      id: 10,
      name: 'Name of skill 10',
      criteria: 'Crtieria of skill 10',
      questions: [],
    },
    '13': {
      id: 13,
      name: 'Name of skill 13',
      criteria: 'Crtieria of skill 13',
      questions: [],
    },
    '14': {
      id: 14,
      name: 'Name of skill 14',
      criteria: 'Crtieria of skill 14',
      questions: [],
    },
    '15': {
      id: 15,
      name: 'Name of skill 15',
      criteria: 'Crtieria of skill 15',
      questions: [],
    },
    '16': {
      id: 16,
      name: 'Name of skill 16',
      criteria: 'Crtieria of skill 16',
      questions: [],
    }
  }
};

describe('evaluation view', () => {
  it('constructs an evaluation view for an evaluation', () => {
    // TODO: Ensure that this test fails when when sorting by category.

    const expected = [
      { skillId: 16, skillGroupId: 20, name: 'Name of skill 16', criteria: 'Crtieria of skill 16', questions: [], category: 'Software Design', level: 'Novice' },
      { skillId: 13, skillGroupId: 2, name: 'Name of skill 13', criteria: 'Crtieria of skill 13', questions: [], category: 'Software Design', level: 'Experienced Beginner' },
      { skillId: 15, skillGroupId: 7, name: 'Name of skill 15', criteria: 'Crtieria of skill 15', questions: [], category: 'Software Design', level: 'Knowledgeable' },
      { skillId: 14, skillGroupId: 15, name: 'Name of skill 14', criteria: 'Crtieria of skill 14', questions: [], category: 'Vision and Ownership', level: 'Novice' },
      { skillId: 10, skillGroupId: 1, name: 'Name of skill 10', criteria: 'Crtieria of skill 10', questions: [], category: 'Vision and Ownership', level: 'Experienced Beginner' },
      { skillId: 2, skillGroupId: 0, name: 'Name of skill 2', criteria: 'Crtieria of skill 2', questions: [],category: 'Vision and Ownership', level: 'Knowledgeable' },
    ];

    expect(constructPaginatedView(evaluation)[0]).to.eql(expected[0]);
  });
});