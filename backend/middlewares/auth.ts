import * as Promise from 'bluebird';

import auth from '../models/auth';
import users from '../models/users';
import evaluations from '../models/evaluations';
import permissions from '../models/users/permissions';
import {
  EVALUATION_NOT_FOUND,
  INVALID_EVALUATION_ID,
  INVALID_USER_ID,
  MUST_BE_ADMIN,
  MUST_BE_LOGGED_IN,
  USER_NOT_FOUND,
} from '../handlers/errors';
import { ObjectID } from 'bson';

export const populateUser = (req, res, next) =>
  (req.cookies[auth.cookieName]
    ? auth.verify(req.cookies[auth.cookieName])
      .then((data: { username: string }) =>
        users.getUserByUsername(data.username)
          .then((user) => {
            res.locals.user = user;
            next();
          }))
      .catch(next)
    : next());

export const getRequestedUser = (req, res, next) =>
  (req.params.userId && ObjectID.isValid(req.params.userId)
    ? Promise.try(() => users.getUserById(req.params.userId))
      .then((user) => {
        if (user) {
          res.locals.requestedUser = user;
          return next();
        }
        res.status(404).json(USER_NOT_FOUND());
      })
      .catch(next)
    : res.status(400).json(INVALID_USER_ID(req.params.userId)));

export const getRequestedEvaluation = (req, res, next) =>
  (req.params.evaluationId && ObjectID.isValid(req.params.evaluationId)
    ? Promise.try(() => evaluations.getEvaluationById(req.params.evaluationId))
      .then((evaluation) => {
        if (evaluation) {
          res.locals.requestedEvaluation = evaluation;
          return users.getUserById(evaluation.user.id);
        }
        res.status(404).json(EVALUATION_NOT_FOUND());
      })
      .then((user) => {
        if (user) {
          res.locals.evaluationUser = user;
          next();
        }
      })
      .catch(next)
    : res.status(400).json(INVALID_EVALUATION_ID(req.params.userId)));

export const getUserPermissions = (req, res, next) => {
  const requestedUser = res.locals.requestedUser;
  const evaluationUser = res.locals.evaluationUser;
  const loggedInUser = res.locals.user;
  // either requestedUser OR evaluationUser will exist; doesn't make sense for both to be requested at the same time.
  res.locals.permissions = permissions(loggedInUser, requestedUser || evaluationUser);
  next();
};

export const ensureLoggedIn = (req, res, next) => (!res.locals.user ? res.status(401).json(MUST_BE_LOGGED_IN()) : next());
export const ensureAdmin = (req, res, next) => {
  if (!res.locals.user) {
    return res.status(401).json(MUST_BE_LOGGED_IN());
  }
  return res.locals.user && res.locals.user.isAdmin() ? next() : res.status(403).json(MUST_BE_ADMIN());
};
