const keymirror = require('keymirror');

const status = keymirror({
  NEW: null,
});

module.exports = ({ _id, user }) => Object.freeze({
  get viewModel() {
    return { url: `${process.env.HOST}/#/evaluations/${_id}`, id: _id, usersName: user.name };
  }
});

module.exports.newEvaluation = (template, user, skills, date = new Date()) => {
  return {
    user: user.evaluationData,
    createdDate: date,
    status: status.NEW,
    template: template.evaluationData,
    skillGroups: template.createSkillGroups(skills),
  };
};
