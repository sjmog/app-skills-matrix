import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';

import api from '../../api';
import { normalizeEvaluation } from '../normalize';

export const EVALUATION_VIEW = keymirror({
  MENTOR: null,
  SUBJECT: null,
});

export const SKILL_STATUS = keymirror({
  ATTAINED: null,
});

export const EVALUATION_STATUS = keymirror({
  MENTOR_REVIEW_COMPLETE: null,
  SELF_EVALUATION_COMPLETE: null,
  NEW: null,
});

export const constants = keymirror({
  RETRIEVE_EVALUATION_SUCCESS: null,
  RETRIEVE_EVALUATION_FAILURE: null,
  SKILL_STATUS_UPDATE_SUCCESS: null,
  SKILL_STATUS_UPDATE_FAILURE: null,
  EVALUATION_COMPLETE_SUCCESS: null,
  EVALUATION_COMPLETE_FAILURE: null,
});

const retrieveEvaluationSuccess = createAction(
  constants.RETRIEVE_EVALUATION_SUCCESS,
  normalizedEvaluation => normalizedEvaluation
);

const retrieveEvaluationFailure = createAction(
  constants.RETRIEVE_EVALUATION_FAILURE,
  error => error
);

const updateSkillStatusSuccess = createAction(
  constants.SKILL_STATUS_UPDATE_SUCCESS,
  (skillId, status) => ({ skillId, status })
);

const updateSkillStatusFailure = createAction(
  constants.SKILL_STATUS_UPDATE_FAILURE,
  (skillId, error) => ({ skillId, error })
);

const evaluationCompleteSuccess = createAction(
  constants.EVALUATION_COMPLETE_SUCCESS,
  status => status
);

const evaluationCompleteFailure = createAction(
  constants.EVALUATION_COMPLETE_FAILURE,
  error => error
);

function retrieveEvaluation(evaluationId) {
  return function(dispatch) {
    return api.retrieveEvaluation(evaluationId)
      .then(normalizeEvaluation)
      .then((normalizedEvaluation) => dispatch(retrieveEvaluationSuccess(normalizedEvaluation)))
      .catch((error) => dispatch(retrieveEvaluationFailure(error)))
  }
}

function updateSkillStatus(evaluationId, skillId, status) {
  return function(dispatch, getState) {
    const { skillGroups } = getState().evaluation;
    const skillGroupId = R.keys(R.filter((group, key) => R.contains(skillId, group.skills), skillGroups))[0];

    return api.updateSkillStatus(evaluationId, skillGroupId, skillId, status)
      .then((update) => dispatch(updateSkillStatusSuccess(skillId, status)))
      .catch((error) => dispatch(updateSkillStatusFailure(skillId, error)))
  }
}

function evaluationComplete(evaluationId) {
  return function(dispatch) {
    return api.evaluationComplete(evaluationId)
      .then((status) => dispatch(evaluationCompleteSuccess(status)))
      .catch((error) => dispatch(evaluationCompleteFailure(error)))
  }
}
export const actions = {
  retrieveEvaluation,
  updateSkillStatus,
  evaluationComplete,
};

const initialSate = {
  error: null,
  status: null,
  template: {},
  skills: {},
  skillGroups: {}
};

export default handleActions({
  [retrieveEvaluationSuccess]:
    (state, action) => R.merge(state, action.payload),
  [retrieveEvaluationFailure]:
    (state, action) => {
      return R.merge(state, { error: action.payload });
    },
  [updateSkillStatusSuccess]:
    (state, action) => {
      const { skillId, status } = action.payload;
      const skills = Object.assign({}, state.skills);
      skills[skillId].status.current = status;
      return R.merge(state, { skills });
    },
  [updateSkillStatusFailure]:
    (state, action) => {
      const { skillId, error } = action.payload;
      const skills = Object.assign({}, state.skills);
      skills[skillId].error = error;
      return R.merge(state, { skills });
    },
  [evaluationCompleteSuccess]:
    (state, action) => {
      return R.merge(state, { status: action.payload.status });
    },
  [evaluationCompleteFailure]:
    (state, action) => {
      return R.merge(state, { error: action.payload });
    },
}, initialSate);

const getSkillGroup = (level, category, skillGroups) =>
  R.find(group => (group.level === level && group.category === category), R.values(skillGroups));

export const getAllSkillsInCategory = (state, category) =>
  R.flatten(
    R.reverse(state.template.levels).map((level) => {
      const { id: skillGroupId, skills } = getSkillGroup(level, category, state.skillGroups);
      return R.reverse(skills.map((id) => Object.assign({}, { id, skillGroupId })));
    }));

export const getView = (state) =>
  R.path(['view'], state);

export const getTemplateName = (state) =>
  R.path(['template', 'name'], state);

export const getSubjectName = (state) =>
  R.path(['subject', 'name'], state);

export const getFirstCategory = (state) => {
  const categories = getCategories(state);
  return categories ? R.head(categories) : undefined;
};

export const getEvaluationStatus = (state) =>
  R.path(['status'], state);

export const getSkillGroups = (state) =>
  R.path(['skillGroups'], state);

export const getSkills = (state) =>
  R.path(['skills'], state);

export const getLevels = (state) => {
  return R.path(['template', 'levels'], state);
};

export const getCategories = (state) =>
  R.path(['template', 'categories'], state);

export const getError = (state) =>
  R.path(['error'], state);