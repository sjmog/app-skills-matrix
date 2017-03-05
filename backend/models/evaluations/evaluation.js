const keymirror = require('keymirror');

const STATUS = keymirror({
  NEW: null,
});

module.exports = ({ _id, user, template, skillGroups, status }) => Object.freeze({
  get viewModel() {
    return { url: `${process.env.HOST}/#/evaluations/${_id}`, id: _id, usersName: user.name, status, templateName: template.name };
  },
  get userEvaluationViewModel() {
    return { user, template, skillGroups };
  }
});

module.exports.newEvaluation = (template, user, skills, date = new Date()) => {
  return {
    user: user.evaluationData,
    createdDate: date,
    status: STATUS.NEW,
    template: template.evaluationData,
    skillGroups: template.createSkillGroups(skills),
  };
};
