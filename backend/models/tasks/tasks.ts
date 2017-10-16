import * as R from 'ramda';

import { Evaluation } from '../evaluations/evaluation';
import task from './task';

type Tasks = {
  taskListViewModel: () => TaskViewModel[],
};

const tasks = (ownNewEvaluations:  Evaluation[], menteeEvaluationsForReview:  Evaluation[], reportEvaluationsForReview:  Evaluation[]): Tasks => ({
  taskListViewModel() {
    return [
      ...R.map(evaluation => task(evaluation).ownEvaluationsViewModel(), ownNewEvaluations),
      ...R.map(evaluation => task(evaluation).menteeEvaluationsForReviewViewModel(), menteeEvaluationsForReview),
      ...R.map(evaluation => task(evaluation).reportEvaluationsForReviewViewModel(), reportEvaluationsForReview),
    ];
  },
});

export default tasks;
