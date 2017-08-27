import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';

export const initialState = {
  entities: {},
  error: {},
};

export default (state = {}) => state; /* prortion of state never requires updating */

export const getUser = (state, userId) =>
  R.path(['entities', userId], state);
