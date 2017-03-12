import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';

import api from '../../api';
import normalize from '../normalize';

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
      .then(normalize)
      .then((normalizedEvaluation) => dispatch(retrieveEvaluationSuccess(normalizedEvaluation)))
      .catch((error) => dispatch(retrieveEvaluationFailure(error)))
  }
}

function updateSkillStatus(evaluationId, skillGroupId, skillId, status) {
  return function(dispatch) {
    return api.updateSkillStatus(evaluationId, skillGroupId, skillId, status)
      .then((update) => dispatch(updateSkillStatusSuccess(update.skillId, update.status)))
      .catch((error) => dispatch(updateSkillStatusFailure(skillId, error)))
  }
}

function evaluationComplete(evaluationId) {
  return function(dispatch) {
    return api.evaluationComplete(evaluationId)
      .then(({ status }) => dispatch(evaluationCompleteSuccess(status)))
      .catch((error) => dispatch(evaluationCompleteFailure(error)))
  }
}
export const actions = {
  retrieveEvaluation,
  updateSkillStatus,
  evaluationComplete,
};

const initialSate = {
  evaluation: {},
  template: {},
  skills: {},
  skillGroups: {}
};

export const reducers = handleActions({
  [retrieveEvaluationSuccess]:
    (state, action) => R.merge(state, action.payload),
  [retrieveEvaluationFailure]:
    (state, action) => {
      const evaluation = Object.assign({}, state.evaluation);
      evaluation.error = action.payload;
      return R.merge(state, { evaluation })
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
      const evaluation = Object.assign({}, state.evaluation);
      evaluation.status = action.payload;
      return R.merge(state, { evaluation });
    },
  [evaluationCompleteFailure]:
    (state, action) => {
      const evaluation = Object.assign({}, state.evaluation);
      evaluation.error = action.payload;
      return R.merge(state, { evaluation });
    },
}, initialSate);