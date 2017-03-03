import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import api from '../../api';

import normalize from '../normalize';

export const constants = keymirror({
  RETRIEVE_EVALUATION_SUCCESS: null,
  RETRIEVE_EVALUATION_FAILURE: null,
});

const retrieveEvaluationSuccess = createAction(
  constants.RETRIEVE_EVALUATION_SUCCESS,
  evaluation => Object.assign({}, evaluation)
);

const retrieveEvaluationFailure = createAction(
  constants.RETRIEVE_EVALUATION_FAILURE,
  error => Object.assign({}, error)
);

function retrieveEvaluation(evaluationId) {
  return function (dispatch) {
    return api.retrieveEvaluation(evaluationId)
      .then(normalize)
      .then((evaluation) => dispatch(retrieveEvaluationSuccess(evaluation)))
      .catch((err) => dispatch(retrieveEvaluationFailure(err)))
  }
}
export const actions = {
  retrieveEvaluation,
};

const initialSate = {
  evaluationRetrieved: false,
  template: {},
  skills: {},
  skillGroups: {}
};

export const reducers = handleActions({
  [retrieveEvaluationSuccess]: (state, action) => Object.assign({}, state, action.payload, { evaluationRetrieved: true }),
  [retrieveEvaluationFailure]: (state, action) =>  Object.assign({}, state, { error: action.payload, evaluationRetrieved: false })
}, initialSate);