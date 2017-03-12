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
});

const retrieveEvaluationSuccess = createAction(
  constants.RETRIEVE_EVALUATION_SUCCESS,
  evaluation => Object.assign({}, evaluation)
);

const retrieveEvaluationFailure = createAction(
  constants.RETRIEVE_EVALUATION_FAILURE,
  error => Object.assign({}, error)
);

const updateSkillStatusSuccess = createAction(
  constants.SKILL_STATUS_UPDATE_SUCCESS,
  (updatedSkills) => Object.assign({}, { skills: updatedSkills })
);

const updateSkillStatusFailure = createAction(
  constants.SKILL_STATUS_UPDATE_FAILURE,
  (updatedSkills) => Object.assign({}, { skills: updatedSkills })
);

function retrieveEvaluation(evaluationId) {
  return function(dispatch) {
    return api.retrieveEvaluation(evaluationId)
      .then(normalize)
      .then((evaluation) => dispatch(retrieveEvaluationSuccess(evaluation)))
      .catch((err) => dispatch(retrieveEvaluationFailure(err)))
  }
}

function updateSkillStatus(evaluationId, skillGroupId, skillId, status) {
  return function(dispatch, getState) {
    return api.updateSkillStatus(evaluationId, skillGroupId, skillId, status)
      .then((update) => {
        const skills = Object.assign({}, getState().manageEvaluation.skills);
        skills[update.skillId].status.current = update.status;

        return dispatch(updateSkillStatusSuccess(skills))
      })
      .catch((error) => {
        const skills = Object.assign({}, getState().manageEvaluation.skills);
        skills[update.skillId].error = error;

        return dispatch(updateSkillStatusFailure(skills))
      })
  }
}
export const actions = {
  retrieveEvaluation,
  updateSkillStatus
};

const initialSate = {
  evaluationRetrieved: false,
  template: {},
  skills: {},
  skillGroups: {}
};

export const reducers = handleActions({
  [retrieveEvaluationSuccess]: (state, action) => Object.assign({}, state, action.payload, { evaluationRetrieved: true }),
  [retrieveEvaluationFailure]: (state, action) =>  Object.assign({}, state, { error: action.payload, evaluationRetrieved: false }),
  [updateSkillStatusSuccess]: (state, action) => R.merge(state, { skills: action.payload.skills }),
  [updateSkillStatusFailure]: (state, action) => R.merge(state, { skills: action.payload.skills }),
}, initialSate);