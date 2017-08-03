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
  OBJECTIVE: null,
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
  EVALUATION_COMPLETE_SUCCESS: null,
  EVALUATION_COMPLETE_FAILURE: null,
});

const retrieveEvaluationSuccess = createAction(
  constants.RETRIEVE_EVALUATION_SUCCESS,
  evaluation => evaluation,
);

const retrieveEvaluationFailure = createAction(
  constants.RETRIEVE_EVALUATION_FAILURE,
  (error, evaluationId) => ({ error, evaluationId }),
);

const evaluationCompleteSuccess = createAction(
  constants.EVALUATION_COMPLETE_SUCCESS,
  (evaluationId, status) => ({ evaluationId, status }),
);

const evaluationCompleteFailure = createAction(
  constants.EVALUATION_COMPLETE_FAILURE,
  (evaluationId, error) => ({ [evaluationId]: error }),
);

export const actions = {
  retrieveEvaluationSuccess,
  retrieveEvaluationFailure,
  evaluationCompleteSuccess,
  evaluationCompleteFailure,
};

function retrieveEvaluation(evaluationId) {
  return dispatch => api.retrieveEvaluation(evaluationId)
    .then(evaluation => dispatch(retrieveEvaluationSuccess(evaluation)))
    .catch(error => dispatch(retrieveEvaluationFailure(error, evaluationId)));
}

function evaluationComplete(evaluationId) {
  return dispatch => api.evaluationComplete(evaluationId)
    .then(({ status }) => dispatch(evaluationCompleteSuccess(evaluationId, status)))
    .catch(error => dispatch(evaluationCompleteFailure(evaluationId, error)));
}

export const actionCreators = {
  retrieveEvaluation,
  evaluationComplete,
};

const initialState = {
  entities: {},
  errors: {},
  fetchStatus: {},
};

export default handleActions({
  [retrieveEvaluationSuccess]: (state, action) => {
    const evalWithSkillUidsArray = R.merge(action.payload, { skills: R.keys(action.payload.skills) });
    const entities = R.merge(state.entities, { [action.payload.id]: evalWithSkillUidsArray });
    const fetchStatus = R.merge(state.fetchStatus, { [action.payload.id]: EVALUATION_FETCH_STATUS.LOADED });
    return R.merge(state, { entities, fetchStatus });
  },
  [retrieveEvaluationFailure]: (state, action) => {
    const { evaluationId, error } = action.payload;
    const errors = R.merge(state.errors, { [evaluationId]: error });
    const fetchStatus = R.merge(state.fetchStatus, { [evaluationId]: EVALUATION_FETCH_STATUS.FAILED });
    return R.merge(state, { errors, fetchStatus });
  },
  [evaluationCompleteSuccess]: (state, action) => {
    const { evaluationId, status } = action.payload;
    const evaluationStatusLens = R.lensPath(['entities', evaluationId, 'status']);

    return R.set(evaluationStatusLens, status, state);
  },
  [evaluationCompleteFailure]: (state, action) => {
    const errors = R.merge(state.errors, action.payload);

    return R.merge(state, { errors });
  },
}, initialState);

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

export const getSkillUids = (state, evalId) =>
  R.path(['entities', evalId, 'skills'], state);

export const getLevels = (state, evalId) =>
  R.path(['entities', evalId, 'template', 'levels'], state);

export const getCategories = (state, evalId) =>
  R.path(['entities', evalId, 'template', 'categories'], state);

export const getError = (state, evalId) =>
  R.path(['errors', evalId], state);

export const getSkillGroupsWithReversedSkills = (state, evalId) => {
  const reverseSkills = skillGroup =>
    Object.assign({}, skillGroup, { skills: R.reverse(skillGroup.skills) });

  return R.map(reverseSkills)(getSkillGroups(state, evalId));
};
