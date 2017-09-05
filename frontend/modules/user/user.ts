import { handleActions } from 'redux-actions';
import * as R from 'ramda';

export default (state = {}) => state; /* portion of state never requires updating */

export const getLoggedInUsername = state =>
  R.path(['userDetails', 'username'], state);

export const getLoggedInUserId = state =>
  R.path(['userDetails', 'id'], state);

const getUrl = (keyName: string, state) => {
  const url: string = R.path(['evaluations', 0, keyName], state);
  return R.is(String, url) ? url : null;
};

export const getFeedbackUrlForLatestEval = state =>
  getUrl('feedbackUrl', state);

export const getObjectivesUrlForLatestEval = state =>
  getUrl('objectivesUrl', state);
