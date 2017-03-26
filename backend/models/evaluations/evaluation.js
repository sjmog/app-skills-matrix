const keymirror = require('keymirror');
const R = require('ramda');

const HOST = process.env.HOST;

const STATUS = keymirror({
  NEW: null,
  SELF_EVALUATION_COMPLETE: null,
  MENTOR_REVIEW_COMPLETE: null,
});

const VIEW = keymirror({
  SUBJECT: null,
  MENTOR: null,
});

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
  get subjectEvaluationViewModel() {
    return { user, status, template, skillGroups, view: VIEW.SUBJECT  };
  },
  get mentorEvaluationViewModel() {
    return { user, status, template, skillGroups, view: VIEW.MENTOR };
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
      lensById(Number(skillGroupId)),
      R.lensProp('skills'),
      lensById(Number(skillId)),
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
  selfEvaluationComplete: function () {
    return {
      id: _id,
      user,
      createdDate,
      template,
      skillGroups,
      status: STATUS.SELF_EVALUATION_COMPLETE
    }
  },
  selfEvaluationCompleted: function () {
    return status === STATUS.SELF_EVALUATION_COMPLETE
  },
  mentorReviewComplete: function () {
    return {
      id: _id,
      user,
      createdDate,
      template,
      skillGroups,
      status: STATUS.MENTOR_REVIEW_COMPLETE,
    }
  },
  mentorReviewCompleted: function () {
    return status === STATUS.MENTOR_REVIEW_COMPLETE;
  }
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


