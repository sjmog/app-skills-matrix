import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';

import api from '../../api';

import normalize from '../normalize';

export const constants = keymirror({
  RETRIEVE_EVALUATION_SUCCESS: null,
  RETRIEVE_EVALUATION_FAILURE: null,
  SKILL_STATUS_UPDATE: null,
});

const retrieveEvaluationSuccess = createAction(
  constants.RETRIEVE_EVALUATION_SUCCESS,
  evaluation => Object.assign({}, evaluation)
);

const retrieveEvaluationFailure = createAction(
  constants.RETRIEVE_EVALUATION_FAILURE,
  error => Object.assign({}, error)
);

const updateSkillStatus = createAction(
  constants.SKILL_STATUS_UPDATE,
  (skillId, status) => Object.assign({}, { skillId, status })
);

function retrieveEvaluation(evaluationId) {
  return function(dispatch) {
    return api.retrieveEvaluation(evaluationId)
      .then(normalize)
      .then((evaluation) => dispatch(retrieveEvaluationSuccess(evaluation)))
      .catch((err) => dispatch(retrieveEvaluationFailure(err)))
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

const handleUpdateSkillStatus = (state, action) => {
  const updatedSkill = state.skills[action.payload.skillId];
  updatedSkill.status = action.payload.status;
  const updatedSkills = R.merge(state.skills, { [action.payload.skillId]: updatedSkill });

  return Object.assign({}, state, { skills: updatedSkills } );
};
export const reducers = handleActions({
  [retrieveEvaluationSuccess]: (state, action) => Object.assign({}, state, action.payload, { evaluationRetrieved: true }),
  [retrieveEvaluationFailure]: (state, action) =>  Object.assign({}, state, { error: action.payload, evaluationRetrieved: false }),
  [updateSkillStatus]: handleUpdateSkillStatus,
}, initialSate);