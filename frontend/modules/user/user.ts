import { handleActions } from 'redux-actions';
import * as R from 'ramda';

export default (state = {}) => state; /* portion of state never requires updating */

export const getLoggedInUsername = (state): string =>
  R.path(['userDetails', 'username'], state);

export const getLoggedInUserId = (state): string =>
  R.path(['userDetails', 'id'], state);

const getUrl = (keyName, state): string => {
  const url: string = R.path(['evaluations', 0, keyName], state);
  return R.is(String, url) ? url : null;
};

export const getFeedbackUrlForLatestEval = (state): string =>
  getUrl('feedbackUrl', state);

export const getObjectivesUrlForLatestEval = (state): string  =>
  getUrl('objectivesUrl', state);
