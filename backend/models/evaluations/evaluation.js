const keymirror = require('keymirror');

const status = keymirror({
  NEW: null,
});

module.exports = ({ id }) => Object.freeze({
  get viewModel() {
    return { id };
  }
});

module.exports.newEvaluation = (template, user, skills, date = new Date()) => {
  return {
    id: `${user.id}-${date}`, //todo: format
    userId: user.id,
    createdDate: date,
    status: status.NEW,
    template: template.evaluationData,
    skillGroups: template.createSkillGroups(skills),
  };
};
