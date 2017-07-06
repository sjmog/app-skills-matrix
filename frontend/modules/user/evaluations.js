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
  (evaluationId, skillId, error) => ({ evaluationId, skillId, error })
);

const evaluationCompleteSuccess = createAction(
  constants.EVALUATION_COMPLETE_SUCCESS,
  (evaluationId, status) => ({ evaluationId, status })
);

const evaluationCompleteFailure = createAction(
  constants.EVALUATION_COMPLETE_FAILURE,
  (evaluationId, error) => ({ [evaluationId]: error })
);

function retrieveEvaluation(evaluationId) {
  return function (dispatch) {
    return api.retrieveEvaluation(evaluationId)
      .then((evaluation) => dispatch(retrieveEvaluationSuccess(evaluation)))
      .catch((error) => dispatch(retrieveEvaluationFailure(error, evaluationId)))
  }
}

function updateSkillStatus(evaluationView, evaluationId, skillId, status) {
  return function(dispatch, getState) {
    const skillGroups = R.path(['entities', 'evaluations', 'entities', evaluationId, 'skillGroups'],  getState());
    const skillGroupId = R.keys(R.filter((group, key) => R.contains(skillId, group.skills), skillGroups))[0];

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
      .catch((error) => dispatch(updateSkillStatusFailure(evaluationId, skillId, error)))
  }
}

function evaluationComplete(evaluationId) {
  return function (dispatch) {
    return api.evaluationComplete(evaluationId)
      .then(({ status }) => dispatch(evaluationCompleteSuccess(evaluationId, status)))
      .catch((error) => dispatch(evaluationCompleteFailure(evaluationId, error)))
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
    const skillLens = R.lensPath(['entities', evaluationId, 'skills', skillId]);
    const skill = R.view(skillLens, state);

    const updatedSkill = {
      ...skill,
      status: { ...skill.status, current: status },
      error: null
    };

    return R.set(skillLens, updatedSkill, state);
  },
  [updateSkillStatusFailure]: (state, action) => {
    const { evaluationId, skillId, error } = action.payload;
    const skillErrorLens = R.lensPath(['entities', evaluationId, 'skills', skillId, 'error']);

    return R.set(skillErrorLens, error, state);
  },
  [evaluationCompleteSuccess]: (state, action) => {
    const { evaluationId, status } = action.payload;
    const evaluationStatusLens =  R.lensPath(['entities',  evaluationId, 'status']);

    return R.set(evaluationStatusLens, status, state);
  },
  [evaluationCompleteFailure]: (state, action) => {
    const errors = R.merge(state.errors, action.payload);

    return R.merge(state, { errors });
  },
}, initialSate);

export const getSkillStatus = (state, skillId, evalId) =>
  R.path(['entities', evalId, 'skills', skillId, 'status'], state);

export const getSubjectName = (state, evalId) =>
  R.path(['entities', evalId, 'subject', 'name'], state);

export const getEvaluationName = (state, evalId) =>
  R.path(['entities', evalId, 'template', 'name'], state);

export const getEvaluationFetchStatus = (state, evalId) =>
  R.path(['fetchStatus', evalId], state);

export const getView = (state, evalId) =>
  R.path(['entities', evalId, 'view'], state);

export const getEvaluationStatus = (state, evalId) =>
  R.path(['entities', evalId, 'status'], state);

export const getSkillGroups = (state, evalId) =>
  R.path(['entities', evalId, 'skillGroups'], state);

export const getSkills = (state, evalId) =>
  R.path(['entities', evalId, 'skills'], state);

export const getLevels = (state, evalId) =>
  R.path(['entities', evalId, 'template', 'levels'], state);

export const getCategories = (state, evalId) =>
  R.path(['entities', evalId, 'template', 'categories'], state);

export const getError = (state, evalId) =>
  R.path(['errors', evalId], state);

export const getErringSkills = (state, evalId) => {
  const skills = getSkills(state, evalId);
  return R.filter((skill) => skill.error)(R.values(skills));
};

export const getSkillGroupsWithReversedSkills = (state, evalId) => {
  const reverseSkills = (skillGroup) => ({
    ...skillGroup,
    skills: R.reverse(skillGroup.skills)
  });

  return R.map(reverseSkills)(getSkillGroups(state, evalId));
};
