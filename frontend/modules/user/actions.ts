import { handleActions, createAction } from 'redux-actions';
import * as keymirror from 'keymirror';
import * as R from 'ramda';
import * as moment from 'moment';

import api from '../../api';

export const constants = keymirror({
  RETRIEVE_ACTION_SUCCESS: null,
  RETRIEVE_ACTION_FAILURE: null,
});

export const ACTION_TYPES = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null,
});

const retrieveActionsSuccess = createAction(
  constants.RETRIEVE_ACTION_SUCCESS,
  (actionType, actions) => ({ actionType, actions }),
);

const retrieveActionsFailure = createAction(
  constants.RETRIEVE_ACTION_FAILURE,
  (actionType, error) => ({ actionType, error }),
);

function retrieveActions(userId, actionType) {
  return dispatch => api.retrieveAllActions(userId, actionType)
      .then(actions => dispatch(retrieveActionsSuccess(actionType, actions)))
      .catch(error => dispatch(retrieveActionsFailure(actionType, error)));
}

export const actions = {
  retrieveActions,
};

const initialSate = {
  feedback: {
    ui: { retrieved: false },
  },
  objective: {
    ui: { retrieved: false },
  },
};

export default handleActions({
  [retrieveActionsSuccess]: (state, action) => {
    const { actionType, actions } = action.payload;
    const newestToOldest = (a, b) => moment(a.createdDate).isBefore(b.createdDate) ? -1 : 1;

    const uniqueEvals = R.uniq(
      R.map(action => ({
        createdDate: R.path(['evaluation', 'createdDate'], action),
        evaluationId: R.path(['evaluation', 'id'], action),
      }), actions),
    ).sort(newestToOldest);

    const actionsGroupedByEvaluation = R.map(
      ({ createdDate, evaluationId }) =>
        ({ createdDate, evaluationId, actions: R.filter(R.pathEq(['evaluation', 'createdDate'], createdDate), actions) }),
      uniqueEvals,
    );
    return R.merge(state, { [actionType.toLowerCase()]: { actions: actionsGroupedByEvaluation, ui: { retrieved: true } } });
  },
  [retrieveActionsFailure]: (state, action) => {
    const { actionType, error } = action.payload;
    return R.merge(state, { [actionType.toLowerCase()]: { error, ui: { retrieved: false } } });
  },
}, initialSate);


export const getFeedbackForEvaluation = (state, evaluationId) => R.filter(R.pathEq(['evaluationId'], evaluationId))(R.path(['feedback', 'actions'], state));

export const getFeedbackRetrievedStatus = state =>
  R.path(['feedback', 'ui', 'retrieved'], state);

export const getFeedbackError = state =>
  R.path(['feedback', 'error'], state);

export const geObjectivesForEvaluation = (state, evaluationId) => R.filter(R.pathEq(['evaluationId'], evaluationId))(R.path(['objective', 'actions'], state));

export const getObjectivesRetrievedStatus = state =>
  R.path(['objective', 'ui', 'retrieved'], state);

export const getObjectivesError = state =>
  R.path(['objective', 'error'], state);
