import { Response, Request, NextFunction } from 'express';
import * as Promise from 'bluebird';
import * as R from 'ramda';

import createHandler, { Locals } from './createHandler';
import evaluations from '../models/evaluations';
import { STATUS, Evaluation } from '../models/evaluations/evaluation';
import users from '../models/users';

const buildTasksList = (ownNewEvaluations: Evaluation[], menteeEvaluationsForReview: Evaluation[], reportEvaluationsForReview: Evaluation[]): TaskList => {
  const taskDetails = {
    ownNewEvaluations: (e: Evaluation) => ({
      message: 'Complete your own evaluation',
      link: `/evaluations/${e.id}`,
      testId: 'NEW_EVALUATION',
    }),
    menteeEvaluationsForReview: (e: Evaluation) => ({
      message: `Review ${R.path(['user', 'name'], e)}'s evaluation`,
      link: `/evaluations/${e.id}`,
      testId: 'REVIEW_MENTEE_EVALUATION',
    }),
    reportEvaluationsForReview: (e: Evaluation) => ({
      message: `Final review of ${R.path(['user', 'name'], e)}'s evaluation`,
      link: `/evaluations/${e.id}`,
      testId: 'REVIEW_REPORT_EVALUATION',
    }),
  };

  return [
    ...R.map(taskDetails.ownNewEvaluations, ownNewEvaluations),
    ...R.map(taskDetails.menteeEvaluationsForReview, menteeEvaluationsForReview),
    ...R.map(taskDetails.reportEvaluationsForReview, reportEvaluationsForReview),
  ];
};

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

const handlerFunctions = Object.freeze({
  find: (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { permissions } = <Locals>res.locals;

   permissions.viewTasks()
      .then(() =>
        Promise.all([
          evaluations.get(userId, STATUS.NEW),
          getMenteeEvaluationsForReview(userId),
          getReportEvaluationsForReview(userId),
        ]))
      .then(([ownNewEvaluations, menteeEvaluationsForReview, reportEvaluationsForReview]) =>
        buildTasksList(ownNewEvaluations, menteeEvaluationsForReview, reportEvaluationsForReview))
      .then(tasks => res.status(200).json(tasks))
     .catch(err =>
       (err.status && err.data) ? res.status(err.status).json(err.data) : next(err));
  },
});

export default createHandler(handlerFunctions);
