const keymirror = require('keymirror');

const skill = ({ id, name, version, criteria, type, questions }) => Object.freeze({
  id,
  get viewModel() {
    return { id, name };
  },
  get evaluationData() {
    return { id, name, version, criteria, type, questions };
  },
  get feedbackData() {
    return ({ id, name, criteria });
  }
});

module.exports = skill;

module.exports.SKILL_STATUS = keymirror({
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null
});

module.exports.newSkill = (id, name, type, version = 1, criteria, questions) =>
  ({
    id,
    name,
    type,
    version,
    criteria,
    questions,
    createdDate: new Date()
  });
