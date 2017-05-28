const { expect } = require('chai');
const R = require('ramda');

const evaluation = {
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
      category: 'Vision and Ownership',
      level: 'Novice',
      skills: [
        13,
      ]
    },
  },
  skills: {
    '2': {
      id: 2,
      name: 'Communicates a difficult vision effectively',
      version: 1,
      criteria: '',
      type: 'skill',
      questions: [],
      status: {
        previous: null,
        current: null
      }
    },
    '10': {
      id: 10,
      name: 'Arbitrates difficult decisions without creating resentment',
      version: 1,
      criteria: '',
      type: 'skill',
      questions: [],
      status: {
        previous: 'ATTAINED',
        current: 'ATTAINED'
      }
    },
    '13': {
      id: 13,
      name: 'Communicates a vision effectively',
      version: 1,
      criteria: '',
      type: 'skill',
      questions: [],
      status: {
        previous: null,
        current: null
      }
    },
  }
};

describe('evaluation view', () => {
  it.only('constructs an evaluation view for an evaluation', () => {
    const expected = [
      { skillId: 2, skillGroupId: 0 },
      { skillId: 10, skillGroupId: 1 },
      { skillId: 13, skillGroupId: 2 },
    ];

    const constructEvaluationView = (evaluation) => {
      const skillGroups = R.path(['skillGroups'], evaluation);

      const assignSkillGroupIdToSkills = ({ id: skillGroupId, skills }) =>
        R.map((skillId) => ({ skillId, skillGroupId}))(skills);

      return R.compose(
        R.flatten,
        R.map(assignSkillGroupIdToSkills),
        R.values
      )(skillGroups);
    };


    expect(constructEvaluationView(evaluation)).to.eql(expected);
  });
});