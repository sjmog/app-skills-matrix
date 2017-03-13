const keymirror = require('keymirror');
const R = require('ramda');

const HOST = process.env.HOST;

const lensMatching = (pred) =>
  R.lens(
    R.find(pred),
    (newVal, arr) => {
      const index = R.findIndex(pred, arr);
      return R.update(index, newVal, arr);
    }
  );

const lensById = R.compose(lensMatching, R.propEq('id'));

const evaluation = ({ _id, user, createdDate, template, skillGroups, status }) => Object.freeze({
  id: _id,
  user,
  createdDate,
  template,
  skillGroups,
  status,
  get viewModel() {
    return { url: `${HOST}/#/evaluations/${_id}`, id: _id, usersName: user.name, status, templateName: template.name };
  },
  get userEvaluationViewModel() {
    return { user, status, template, skillGroups };
  },
  get mailData() {
    return {
      recipients: user.email,
      subject: 'A new evaluation has been triggered',
      body: `Please visit ${`${HOST}/#/evaluations/${_id}`} to complete your evaluation`,
    }
  },
  updateSkill: function (skillGroupId, skillId, newSkillStatus) {
    const skillLens = R.compose(
      lensById(skillGroupId),
      R.lensProp('skills'),
      lensById(skillId),
      R.lensPath(['status', 'current'])
    );

    const updatedSkillGroups = R.set(skillLens, newSkillStatus, skillGroups);

    return {
      id: _id,
      user,
      createdDate,
      template,
      skillGroups: updatedSkillGroups,
      status
    }
  },
  complete: function () {
    return {
      id: _id,
      user,
      createdDate,
      template,
      skillGroups,
      status: STATUS.COMPLETE
    }
  }
});

const STATUS = keymirror({
  NEW: null,
  COMPLETE: null,
});

module.exports = evaluation;
module.exports.STATUS = STATUS;
module.exports.newEvaluation = (template, user, skills, date = new Date()) => {
  return {
    user: user.evaluationData,
    createdDate: date,
    status: STATUS.NEW,
    template: template.evaluationData,
    skillGroups: template.createSkillGroups(skills),
  };
};


