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

// TODO: Fix types - UserDetailsViewModel
export const getUser = (state, userId) =>
  R.path(['entities', userId], state) || {};
