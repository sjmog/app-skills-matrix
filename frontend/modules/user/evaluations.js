import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';

import api from '../../api';

export const EVALUATION_VIEW = keymirror({
  MENTOR: null,
  SUBJECT: null,
  ADMIN: null,
});

export const SKILL_STATUS = keymirror({
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null
});

export const EVALUATION_STATUS = keymirror({
  MENTOR_REVIEW_COMPLETE: null,
  SELF_EVALUATION_COMPLETE: null,
  NEW: null,
});

export const EVALUATION_FETCH_STATUS = keymirror({
  LOADED: null,
  FAILED: null,
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
  (error, evaluationId) => ({ error, evaluationId })
);

const updateSkillStatusSuccess = createAction(
  constants.SKILL_STATUS_UPDATE_SUCCESS,
  (evaluationId, skillId, status) => ({ evaluationId, skillId, status })
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
  return function (dispatch) {
    return api.retrieveEvaluation(evaluationId)
      .then((evaluation) => dispatch(retrieveEvaluationSuccess(evaluation)))
      .catch((error) => {
        return dispatch(retrieveEvaluationFailure(error, evaluationId))
      })
  }
}

function updateSkillStatus(evaluationView, evaluationId, skillId, skillGroupId, status) {
  return function(dispatch) {

    let updateSkillFn;
    if (evaluationView === EVALUATION_VIEW.MENTOR) {
      updateSkillFn = api.mentorUpdateSkillStatus;
    } else if (evaluationView === EVALUATION_VIEW.SUBJECT) {
      updateSkillFn = api.subjectUpdateSkillStatus;
    } else if (evaluationView === EVALUATION_VIEW.ADMIN) {
      updateSkillFn = api.adminUpdateSkillStatus;
    } else {
      updateSkillFn = () => Promise.reject(new Error('Unknown user role'));
    }

    return updateSkillFn(evaluationId, skillGroupId, skillId, status)
      .then((update) => dispatch(updateSkillStatusSuccess(evaluationId, skillId, status)))
      .catch((error) => dispatch(updateSkillStatusFailure(skillId, error)))
  }
}

function evaluationComplete(evaluationId) {
  return function (dispatch) {
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
  entities: {},
  errors: {},
  fetchStatus: {},
};

export default handleActions({
  [retrieveEvaluationSuccess]: (state, action) => {
    const entities = R.merge(state.entities, { [action.payload.id]: action.payload });
    const fetchStatus = R.merge(state.fetchStatus, { [action.payload.id]: EVALUATION_FETCH_STATUS.LOADED });
    return R.merge(state, { entities, fetchStatus });
  },
  [retrieveEvaluationFailure]: (state, action) => {
    const { evaluationId, error } = action.payload;
    const errors = R.merge(state.errors, { [evaluationId]: error });
    const fetchStatus = R.merge(state.fetchStatus, { [evaluationId]: EVALUATION_FETCH_STATUS.FAILED });
    return R.merge(state, { errors, fetchStatus });
  },
  [updateSkillStatusSuccess]: (state, action) => {
    const { evaluationId, skillId, status } = action.payload;
    var skillStatusLens =  R.lensPath(['entities', evaluationId, 'skills', skillId, 'status', 'current']);
    return R.set(skillStatusLens, status, state);
  },
  //[updateSkillStatusFailure]: (state, action) => {
  //  const { skillId, error } = action.payload;
  //  const skills = Object.assign({}, state.skills);
  //  skills[skillId].error = error;
  //  return R.merge(state, { skills });
  //},
  [evaluationCompleteSuccess]: (state, action) => {
    return R.merge(state, { status: action.payload.status });
  },
  [evaluationCompleteFailure]: (state, action) => {
    return R.merge(state, { error: action.payload });
  },
}, initialSate);

export const getCurrentSkillStatus = (state, skillId, evalId) =>
  R.path([evalId, 'skills', skillId, 'status', 'current'], state.entities);

export const getSkillGroup = (state, skillGroupId, evalId) =>
  R.path([evalId, 'skillGroups', skillGroupId], state.entities);

export const getSubjectName = (state, evalId) =>
  R.path([evalId, 'subject', 'name'], state.entities);

export const getEvaluationName = (state, evalId) =>
  R.path([evalId, 'template', 'name'], state.entities);

export const getEvaluationFetchStatus = (state, evalId) =>
  R.path([evalId], state.fetchStatus);

export const getAllSkillsInCategory = (state, category, evalId) => {
  const evaluation = state[evalId];

  if (!evaluation) return null;

  return R.flatten(
    R.reverse(evaluation.template.levels).map((level) => {
      const { id: skillGroupId, skills } = getSkillGroup(level, category, evaluation.skillGroups);
      return R.reverse(skills.map((id) => Object.assign({}, { id, skillGroupId })));
    }));
};

export const getView = (state, evalId) =>
  R.path(['entities', evalId, 'view'], state);

export const getTemplateName = (state, evalId) =>
  R.path([evalId, 'template', 'name'], state.entities);

export const getEvaluationStatus = (state, evalId) =>
  R.path(['entities', evalId, 'status'], state);

export const getSkillGroups = (state, evalId) =>
  R.path([evalId, 'skillGroups'], state.entities);

export const getSkills = (state, evalId) =>
  R.path([evalId, 'skills'], state.entities);

export const getLevels = (state, evalId) =>
  R.path([evalId, 'template', 'levels'], state.entities);

export const getCategories = (state, evalId) =>
  R.path([evalId, 'template', 'categories'], state.entities);

export const getError = (state, evalId) =>
  R.path([evalId], state.errors);

export const getLowestUnevaluatedSkill = (state, category) => {
  const skillsInCategory = getAllSkillsInCategory(state, category);
  const hasUnevaluatedSkills = ({ id }) => state.skills[id].status.current === null;

  const unevaluatedSkill = R.find(hasUnevaluatedSkills)(skillsInCategory);
  return unevaluatedSkill || R.last(skillsInCategory);
};

export const getErringSkills = (state) => {
  const skills = getSkills(state);
  return R.filter((skill) => skill.error)(R.values(skills));
};

const unevaluated = (skill) =>
 R.path(['status', 'current'], skill) === null;

export const getNextCategory = (state, category, evalId) => {
  const evaluation = R.path([evalId, 'entities'], state);

  if (!evaluation) return null;

  const indexOfCurrentCategory = evaluation.template.categories.indexOf(category) || 0;
  const remainingCategories = R.slice(indexOfCurrentCategory + 1, Infinity, evaluation.template.categories);

  const hasUnevaluatedSkills = (category) => {
    const skillsInCategory = getAllSkillsInCategory(state, category, evalId).map(({ id }) => evaluation.skills[id]);
    const unevaluatedSkills = R.filter(unevaluated)(R.values(skillsInCategory));

    return unevaluatedSkills.length > 0;
  };

  return R.find(hasUnevaluatedSkills)(remainingCategories);
};
