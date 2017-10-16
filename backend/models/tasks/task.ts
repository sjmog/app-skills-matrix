import * as R from 'ramda';

import { Evaluation } from '../evaluations/evaluation';

type Task = {
  ownEvaluationsViewModel: () => TaskViewModel,
  menteeEvaluationsForReviewViewModel: () => TaskViewModel,
  reportEvaluationsForReviewViewModel: () => TaskViewModel,
};

const task = (evaluation: Evaluation): Task => ({
  ownEvaluationsViewModel() {
    return {
      message: 'Complete your own evaluation',
      link: `/evaluations/${evaluation.id}`,
      testId: 'NEW_EVALUATION',
    };
  },
  menteeEvaluationsForReviewViewModel() {
    return {
      message: `Review ${R.path(['user', 'name'], evaluation)}'s evaluation`,
      link: `/evaluations/${evaluation.id}`,
      testId: 'REVIEW_MENTEE_EVALUATION',
    };
  },
  reportEvaluationsForReviewViewModel() {
     return ({
      message: `Final review of ${R.path(['user', 'name'], evaluation)}'s evaluation`,
      link: `/evaluations/${evaluation.id}`,
      testId: 'REVIEW_REPORT_EVALUATION',
    });
  },
});

export default task;
