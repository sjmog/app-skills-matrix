import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';

import { actions as evaluationsActions } from './evaluations';
import handleEvaluationRetrieved from './utils/entityRetrievedHandler';

export const initialState = {
  entities: {},
};

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: handleEvaluationRetrieved('users'),
}, initialState);

export const getUser = (state, userId) => // TODO: Returns UserDetailsViewModel
  R.path(['entities', userId], state) || {};
