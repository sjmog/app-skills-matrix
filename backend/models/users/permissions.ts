import * as Promise from 'bluebird';
import { User } from './user';

import {
  NOT_AUTHORIZED_TO_MARK_EVAL_AS_COMPLETE,
  NOT_AUTHORIZED_TO_UPDATE_SKILL_STATUS,
  NOT_AUTHORIZED_TO_VIEW_EVALUATION,
  ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS,
  USER_NOT_ADMIN,
} from '../../handlers/errors';

export type Permissions = {
  viewActions: () => Promise<void>,
  viewEvaluation: () => Promise<void>,
  updateSkill: () => Promise<void>,
  admin: () => Promise<void>,
  completeEvaluation: () => Promise<void>,
};

const permissionError = (error: ErrorMessage) => Promise.reject({ status: 403, data: error });

/**
 * Provide permissions for various requests
 * @param {User} loggedInUser the user that made the request
 * @param {User} requestUser the user who is the subject of the request (typically either the requestedUser or the evaluationUser)
 */
const permissions = (loggedInUser: User, requestUser: User): Permissions => {
  const loggedIn = Boolean(loggedInUser);
  const isAdmin = loggedIn && loggedInUser.isAdmin();
  const isMentor = loggedIn && loggedInUser.id === requestUser.mentorId;
  const isUser = loggedIn && loggedInUser.id === requestUser.id;
  return {
    viewActions: () => (isAdmin || isMentor || isUser) ? Promise.resolve() : permissionError(ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS()),
    viewEvaluation: () => (isAdmin || isMentor || isUser) ? Promise.resolve() : permissionError(NOT_AUTHORIZED_TO_VIEW_EVALUATION()),
    updateSkill: () => (isMentor || isUser) ? Promise.resolve() : permissionError(NOT_AUTHORIZED_TO_UPDATE_SKILL_STATUS()),
    admin: () => isAdmin ? Promise.resolve() : permissionError(USER_NOT_ADMIN()),
    completeEvaluation: () => (isMentor || isUser) ? Promise.resolve() : permissionError(NOT_AUTHORIZED_TO_MARK_EVAL_AS_COMPLETE()),
  };
};

export default permissions;
