import { handleActions } from 'redux-actions';
import * as R from 'ramda';

export default (state = {}) => state; /* prortion of state never requires updating */

export const getLoggedInUsername = state =>
  R.path(['userDetails', 'username'], state);

export const getLoggedInUserId = state =>
  R.path(['userDetails', 'id'], state);
