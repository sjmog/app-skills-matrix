const keymirror = require('keymirror');

const STATUS = keymirror({
  NEW: null,
});

const HOST = process.env.HOST;

module.exports = ({ _id, user, template, skillGroups, status }) => Object.freeze({
  get viewModel() {
    return { url: `${HOST}/#/evaluations/${_id}`, id: _id, usersName: user.name, status, templateName: template.name };
  },
  get userEvaluationViewModel() {
    return { user, template, skillGroups };
  },
  get mailData() {
    return {
      recipients: user.email,
      subject: 'A new evaluation has been triggered',
      body: `Please visit ${`${HOST}/#/evaluations/${_id}`} to complete your evaluation`,
    }
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
