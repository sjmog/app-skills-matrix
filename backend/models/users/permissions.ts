import { User } from './user';
import * as Promise from 'bluebird';
import {
  NOT_AUTHORIZED_TO_VIEW_EVALUATION,
  ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS,
} from '../../handlers/errors';

export type Permissions = {
  viewActions: () => Promise<void>,
  viewEvaluation: () => Promise<void>,
};

const permissionError = (error: ErrorMessage) => Promise.reject({ status: 403, data: error });

const permissions = (loggedInUser: User, requestedUser: User): Permissions => {
  const loggedIn = Boolean(loggedInUser);
  const isAdmin = loggedIn && loggedInUser.isAdmin();
  const isMentor = loggedIn && loggedInUser.id === requestedUser.mentorId;
  const isUser = loggedIn && loggedInUser.id === requestedUser.id;
  return {
    viewActions: () => (isAdmin || isMentor || isUser) ? Promise.resolve() : permissionError(ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS()),
    viewEvaluation: () => (isAdmin || isMentor || isUser) ? Promise.resolve() : permissionError(NOT_AUTHORIZED_TO_VIEW_EVALUATION()),
  };
};

export default permissions;
