const Promise = require('bluebird');
const { skills, templates } = require('../backend/models/matrices');

const ensureLocalEnv = () =>
  (process.env.NODE_ENV === 'local'
    ? Promise.resolve()
    : Promise.reject(new Error("Node ENV isn't local")));

const exampleSkills = [
  {
    skillId: 1,
    name: 'Working knowledge of NodeJS',
    acceptanceCriteria: 'Understands the basics of NodeJS & es6 syntax',
    questions: [{"title": 'Do you use ternary operators?'}],
  },
  {
    skillId: 2,
    name: 'Can implement simple solutions with direction',
    acceptanceCriteria: 'Is able to succeed when the solution is given to them and the challenge is to implement it',
    questions: [{"title": 'Can you provide an example?'}],
  },
  {
    skillId: 3,
    name: 'Working knowledge a frontend framework',
    acceptanceCriteria: 'Understands the basics of react or jquery',
    questions: [{"title": 'Do you regularly work on tasks that require the use of either of these technologies'}],
  },
  {
    skillId: 4,
    name: 'Basic understanding of browsers (ie, firefox, safari, chrome, ie)',
    acceptanceCriteria: 'Able to quantify some of the differences between browsers and a basic understanding of how you would go about solving them.',
    questions: [{"title": 'Can you think of a time when a method you wanted to use was not available in a certain browser?'}],
  },
];

const exampleTemplate =
  {
    templateId: 1,
    name: 'Node.js',
    skillGroups: [
      {
        category: 'technicalSkill',
        level: 'novice',
        skills: [1,2]
      },
      {
        category: 'frontendDevelopment',
        level: 'novice',
        skills: [3,4]
      }
    ]
  };

ensureLocalEnv()
  .then(() => Promise.each(exampleSkills, skills.addSkill))
  .then(() => templates.addTemplate(exampleTemplate))
  .then(() => {
    console.log('Sample data added');
    process.exit();
  })
  .catch(err => {
    console.log('There was a problem loading sample data', err);
    process.exit(1)
  });
