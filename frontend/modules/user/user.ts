import { handleActions } from 'redux-actions';
import * as R from 'ramda';

export default (state = {}) => state; /* prortion of state never requires updating */

export const getLoggedInUsername = state =>
  R.path(['userDetails', 'username'], state);

export const getLoggedInUserId = state =>
  R.path(['userDetails', 'id'], state);

// TODO: add test for case when there is no latest.
export const getFeedbackUrlForLatestEval = (state) => {
  const userEvaluations = R.prop('evaluations', state) as any;
  const latestEvaluation = R.head(userEvaluations);
  return R.prop('feedbackUrl', latestEvaluation) || null;
};
// TODO: use a lens here.
export const getObjectivesUrlForLatestEval = (state) => {
  const userEvaluations = R.prop('evaluations', state) as any;
  const latestEvaluation = R.head(userEvaluations);
  return R.prop('objectivesUrl', latestEvaluation) || null;
};
