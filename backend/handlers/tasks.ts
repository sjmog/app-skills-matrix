import { Response, Request, NextFunction } from 'express';
import * as Promise from 'bluebird';
import * as R from 'ramda';

import createHandler, { Locals } from './createHandler';
import evaluations from '../models/evaluations';
import { STATUS } from '../models/evaluations/evaluation';
import users from '../models/users';

const buildTasks = (newEvaluations, menteeEvaluationsForReview, reportEvaluationsForReview) => {
  // TODO: fix this up.
  return R.concat(
    R.map(e => ({ message: 'Complete your own evaluation', link: `/evaluations/${e.id}`, testId: 'NEW_EVALUATION' }), newEvaluations) || [],
    R.map(e => ({ message: `Review ${R.path(['user', 'name'], e)}'s evaluation`, link: `/evaluations/${e.id}`, testId: 'REVIEW_MENTEE_EVALUATION' }), menteeEvaluationsForReview) || [],
  ).concat(R.map(e => ({ message: `Final review of ${R.path(['user', 'name'], e)}'s evaluation`, link: `/evaluations/${e.id}`, testId: 'REVIEW_REPORT_EVALUATION' }), reportEvaluationsForReview) || []);
};

// TODO: MAY WANT TO INTRODUCE GET MENTEES COULD BE MIDDLEWARE.
const getMenteeEvaluationsForReview = (userId: string) => {
  return users.getByMentorId(userId)
    .then(mentees =>
      Promise.map(mentees, m => evaluations.get(R.prop('id', m), STATUS.SELF_EVALUATION_COMPLETE)))
    .then(R.flatten);
};

const getReportEvaluationsForReview = (userId: string) => {
  return users.getByLineManagerId(userId)
    .then(reports =>
      Promise.map(reports, m => evaluations.get(R.prop('id', m), STATUS.MENTOR_REVIEW_COMPLETE)))
    .then(R.flatten);
};

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
        ])) // TODO: should there be any knowledge of status here? Probably not.
      .then(([newEvaluations, menteeEvaluationsForReview, reportEvaluationsForReview]) =>
        buildTasks(newEvaluations, menteeEvaluationsForReview, reportEvaluationsForReview))
      .then(tasks => res.status(200).json({ tasks }))
      .catch(next);
  },
});

export default createHandler(handlerFunctions);
