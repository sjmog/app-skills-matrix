const keymirror = require('keymirror');
const R = require('ramda');

const skill = require('./skill');

const HOST = process.env.HOST;

const STATUS = keymirror({
  NEW: null,
  SELF_EVALUATION_COMPLETE: null,
  MENTOR_REVIEW_COMPLETE: null,
});

const VIEW = keymirror({
  SUBJECT: null,
  MENTOR: null,
  ADMIN: null,
});

const arrayToKeyedObject = (evaluationId, arr) =>
  arr.reduce((acc, item) => Object.assign({}, acc, { [item.id]: item }), {});

const uniqueId = (evaluationId, id) => `${evaluationId}_${id}`;

const makeSkillsUnique = (evaluationId, skillGroups) =>
  R.map(skillGroup => Object.assign({},
    skillGroup,
    { skills: R.map(skillId => uniqueId(evaluationId, skillId))(R.prop('skills', skillGroup)) }))(skillGroups);

const arrayToUniquelyKeyedObject = (evaluationId, arr) =>
  R.reduce(
    (acc, item) => {
      const uid = uniqueId(evaluationId, item.id);
      return Object.assign({}, acc, { [uid]: item });
    }, {}, arr);

const evaluation = ({ _id, user, createdDate, template, skillGroups, status, skills }) => {
  const metadata = {
    createdDate,
    evaluationUrl: `/evaluations/${_id}`,
    feedbackUrl: `/user/${user.id}/evaluations/${_id}/feedback`,
    objectivesUrl: `/user/${user.id}/evaluations/${_id}/objectives`,
    id: _id,
    usersName: user.name,
    status,
    templateName: template.name,
  };

  const viewModelSkills = arrayToUniquelyKeyedObject(_id, skills);

  const viewModel = {
    id: _id,
    subject: user,
    status,
    template,
    skills: viewModelSkills,
    skillUids: R.keys(viewModelSkills),
    skillGroups: arrayToKeyedObject(_id, makeSkillsUnique(_id, skillGroups)),
  };

  return Object.freeze({
    id: _id ? _id.toString() : null,
    user,
    createdDate,
    template,
    skillGroups,
    status,
    get dataModel() {
      return { user, createdDate, template, skillGroups, status, skills };
    },
    get subjectMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.SUBJECT });
    },
    get mentorMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.MENTOR });
    },
    get adminMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.ADMIN });
    },
    get viewModel() {
      return viewModel;
    },
    get subjectEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.SUBJECT });
    },
    get mentorEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.MENTOR });
    },
    get adminEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.ADMIN });
    },
    get newEvaluationEmail() {
      return {
        recipients: user.email,
        subject: 'A new evaluation has been triggered',
        body: `Please visit ${`${HOST}/#/evaluations/${_id}`} to complete your evaluation.`,
      };
    },
    get feedbackData() {
      return ({ id: _id.toString(), createdDate });
    },
    getSelfEvaluationCompleteEmail(mentor) {
      return {
        recipients: mentor.email,
        subject: `${user.name} has completed their self evaluation`,
        body: `Please book a meeting with them and and visit ${`${HOST}/#/evaluations/${_id}`} to review their evaluation.`,
      };
    },
    findSkill(skillId) {
      const val = R.find(s => skillId === s.id, skills);
      return val ? skill(val) : null;
    },
    updateSkill(skillId, newSkillStatus) {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        skills: skills.map(s => (s.id === skillId ? skill(s).updateStatus(newSkillStatus) : s)),
        status,
      };
    },
    isNewEvaluation() {
      return status === STATUS.NEW;
    },
    selfEvaluationComplete() {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        status: STATUS.SELF_EVALUATION_COMPLETE,
      };
    },
    selfEvaluationCompleted() {
      return status === STATUS.SELF_EVALUATION_COMPLETE;
    },
    mentorReviewComplete() {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        status: STATUS.MENTOR_REVIEW_COMPLETE,
      };
    },
    mentorReviewCompleted() {
      return status === STATUS.MENTOR_REVIEW_COMPLETE;
    },
    mergePreviousEvaluation(previousEvaluation) {
      const updateSkill = (skillToUpdate) => {
        const previousSkill = previousEvaluation.findSkill(skillToUpdate.id);
        if (!previousSkill) {
          return Object.assign({}, skillToUpdate, { status: { previous: null, current: null } });
        }
        return Object.assign({}, skillToUpdate, {
          status: {
            previous: previousSkill.currentStatus,
            current: previousSkill.statusForNextEvaluation,
          },
        });
      };
      const updatedSkills = previousEvaluation ? R.map(updateSkill, skills) : skills;
      return evaluation({
        user,
        createdDate,
        template,
        skillGroups,
        skills: updatedSkills,
        status: STATUS.NEW,
      });
    },
  });
};

module.exports = evaluation;
module.exports.STATUS = STATUS;
module.exports.newEvaluation = (template, user, allSkills, date = new Date()) => {
  const { skillGroups, skills } = template.createSkillGroups(allSkills);
  return evaluation({
    user: user.evaluationData,
    createdDate: date,
    status: STATUS.NEW,
    template: template.evaluationData,
    skillGroups,
    skills,
  });
};

