import { combineReducers } from 'redux';

import users, * as fromUsers from './users';
import user, * as fromUser from './user';
import matrices from './matrices';

export default combineReducers({ user, users, matrices });

/* USERS SELECTORS */

export const getUserManagementError = ({ users }) =>
  fromUsers.getUserManagementError(users);

export const getUser = ({ users }, userId: string) =>
  fromUsers.getUser(users, userId);

export const getSortedUsers = ({ users }) =>
  fromUsers.getSortedUsers(users);

/* USER SELECTORS */

export const getLoggedInUsername = ({ user }) =>
  fromUser.getLoggedInUsername(user);
