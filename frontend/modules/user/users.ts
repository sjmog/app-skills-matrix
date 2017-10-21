import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';

import { actions as evaluationsActions } from './evaluations';
import handleEvaluationRetrieved from './utils/entityRetrievedHandler';

type UsersState = {
  entities: NormalizedUsers,
};

export const initialState = {
  entities: {},
};

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: handleEvaluationRetrieved('users'),
}, initialState);

export const getUser = (state: UsersState, userId: string): UserDetailsViewModel | {} =>
  R.path(['entities', userId], state) || {};

export const getUserName = (state: UsersState, userId: string): string => {
  const user = R.path(['entities', userId], state) || {};
  return R.prop('name', user) || R.prop('username', user) || 'Unnamed user';
};

export const getUserEvaluations = (state: UsersState, userId: string): string[] =>
  R.path(['entities', userId, 'evaluations'], state) || [];
