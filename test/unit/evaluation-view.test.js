const { expect } = require('chai');
const R = require('ramda');

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
      id: 2
    },
    '10': {
      id: 10
    },
    '13': {
      id: 13
    },
    '14': {
      id: 14
    },
    '15': {
      id: 15
    },
    '16': {
      id: 16
    }
  }
};

describe('evaluation view', () => {
  it('constructs an evaluation view for an evaluation', () => {
    const expected = [
      { skillId: 16, skillGroupId: 20 },
      { skillId: 13, skillGroupId: 2 },
      { skillId: 15, skillGroupId: 7 },
      { skillId: 14, skillGroupId: 15 },
      { skillId: 10, skillGroupId: 1 },
      { skillId: 2, skillGroupId: 0 },
    ];

    const constructEvaluationView = (evaluation) => {
      const skillGroups = R.path(['skillGroups'], evaluation);
      const levels = R.path(['template', 'levels'], evaluation);
      const categories = R.path(['template', 'categories'], evaluation);

      const category = skillGroup => skillGroup.category;

      const sortByLevel = (category) => {
        const indexOfLevel = (a, b) => levels.indexOf(a.level) > levels.indexOf(b.level);
        return R.sort(indexOfLevel)(R.values(category));
      };

      const assignSkillGroupIdToSkills = ({ id: skillGroupId, skills }) =>
        R.map((skillId) => ({ skillId, skillGroupId }))(skills);

      const sortByCategoryOrder = obj =>
        R.reduce((acc, curr) => [].concat(acc, obj[curr]), [])(categories);

      return R.compose(
        R.flatten,
        R.map(assignSkillGroupIdToSkills),
        sortByCategoryOrder,
        R.map(sortByLevel),
        R.groupBy(category),
        R.values
      )(skillGroups);
    };

    expect(constructEvaluationView(evaluation)).to.eql(expected);
  });
});