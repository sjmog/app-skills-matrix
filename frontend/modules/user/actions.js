import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';
import moment from 'moment';

import api from '../../api';

export const constants = keymirror({
  RETRIEVE_ACTION_SUCCESS: null,
  RETRIEVE_ACTION_FAILURE: null,
});

export const ACTION_TYPES = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null
});

const retrieveActionsSuccess = createAction(
  constants.RETRIEVE_ACTION_SUCCESS,
  (actionType, actions) => ({ actionType, actions })
);

const retrieveActionsFailure = createAction(
  constants.RETRIEVE_ACTION_FAILURE,
  (actionType, error) => ({ actionType, error })
);

function retrieveActions(userId, actionType) {
  return function (dispatch) {
    return api.retrieveActions(userId, actionType)
      .then((actions) => dispatch(retrieveActionsSuccess(actionType, actions)))
      .catch((error) => dispatch(retrieveActionsFailure(actionType, error)))
  }
}

export const actions = {
  retrieveActions,
};

const initialSate = {
  feedback: [],
  objectives: [],
};

export default handleActions({
  [retrieveActionsSuccess]: (state, action) => {
    const { actionType, actions } = action.payload;
    const newestToOldest = (a, b) => moment(a).isBefore(b);
    const uniqueCreatedDates = R.uniq(R.map(R.path(['evaluation', 'createdDate']), actions)).sort(newestToOldest);
    const actionsGroupedByEvaluation = R.map(
      (createdDate) => ({ createdDate, actions: R.filter(R.pathEq(['evaluation', 'createdDate'], createdDate), actions) }),
      uniqueCreatedDates
    );
    return R.merge(state, { [actionType.toLowerCase()]: { actions: actionsGroupedByEvaluation }});
  },
  [retrieveActionsFailure]: (state, action) => {
    const { actionType, error } = action.payload;
    return R.merge(state, { [actionType.toLowerCase()]: { error }});
  },
}, initialSate);
