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

export const getSortedUsers = (state: UsersState, userIds: string[]): UserDetailsViewModel[] => {
  if (!Array.isArray(userIds)) {
    return [];
  }

  const users = R.map(
    userId =>
      R.path(['entities', userId], state) || ({ name: 'Missing user', id: userId }),
    userIds) as UserDetailsViewModel[];

  return R.sortBy(R.prop('name'), users);
};
