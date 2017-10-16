import * as Promise from 'bluebird';
import * as R from 'ramda';

import tasks from './tasks';
import users from '../users';
import evaluations from '../evaluations';
import { STATUS, Evaluation } from '../evaluations/evaluation';

const getEvaluationsWithStatus = (users, status) =>
  Promise.map(users, u => evaluations.get(R.prop('id', u), status));

const getMenteeEvaluationsForReview = (userId: string): Evaluation[] =>
  users.getByMentorId(userId)
    .then(mentees => getEvaluationsWithStatus(mentees, STATUS.SELF_EVALUATION_COMPLETE))
    .then(R.flatten);

const getReportEvaluationsForReview = (userId: string): Evaluation[] =>
  users.getByLineManagerId(userId)
    .then(reports => getEvaluationsWithStatus(reports, STATUS.MENTOR_REVIEW_COMPLETE))
    .then(R.flatten);

export default {
  get: (userId: string) =>
    Promise.all([
      evaluations.get(userId, STATUS.NEW),
      getMenteeEvaluationsForReview(userId),
      getReportEvaluationsForReview(userId),
    ])
      .then(([ownNewEvaluations, menteeEvaluationsForReview, reportEvaluationsForReview]) =>
        tasks(ownNewEvaluations, menteeEvaluationsForReview, reportEvaluationsForReview)),
};
