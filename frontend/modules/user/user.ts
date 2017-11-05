import { handleActions } from 'redux-actions';
import * as R from 'ramda';

export default (state = {}) => state; /* portion of state never requires updating */

export const getLoggedInUsername = (state: UserDetailsViewModel): string =>
  R.path(['userDetails', 'username'], state);

export const getLoggedInUserId = (state: UserDetailsViewModel): string =>
  R.path(['userDetails', 'id'], state);

const getUrl = (keyName: string, state): string => {
  const url: string = R.path(['evaluations', 0, keyName], state);
  return R.is(String, url) ? url : null;
};

export const getFeedbackUrlForLatestEval = (state: UserDetailsViewModel): string =>
  getUrl('feedbackUrl', state);

export const getObjectivesUrlForLatestEval = (state: UserDetailsViewModel): string =>
  getUrl('objectivesUrl', state);

export const getLoggedInUserAdminStatus = (state: UserDetailsViewModel): boolean =>
  R.path(['userDetails', 'isAdmin'], state);
