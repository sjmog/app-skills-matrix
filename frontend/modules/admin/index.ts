import { combineReducers } from 'redux';

import users, * as fromUsers from './users';
import matrices from './matrices';

export default combineReducers({ users, matrices });

export const getUserManagementError = ({ users }) =>
  fromUsers.getUserManagementError(users);

export const getUser = ({ users }, userId: string) =>
  fromUsers.getUser(users, userId);

export const getSortedUsers = ({ users }) =>
  fromUsers.getSortedUsers(users);
