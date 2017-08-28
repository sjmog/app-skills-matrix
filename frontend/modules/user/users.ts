import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';

import { actions as evaluationsActions } from './evaluations';

export const initialState = {
  entities: {},
};

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: (state, action) => { // TODO: Add test coverage (e.g. adds rather than removes)
    const users = R.path(['payload', 'users'], action);
    const entities = R.merge(state.entities, users);
    return R.merge(state, { entities });
  },
}, initialState);

export const getUser = (state, userId) =>
  R.path(['entities', userId], state) || {};
