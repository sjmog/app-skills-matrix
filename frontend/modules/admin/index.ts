import { combineReducers } from 'redux';

import users, * as fromUsers from './users';
import matrices from './matrices';

export default combineReducers({ users, matrices });

export const getUserManagementError = ({ users }) =>
  fromUsers.getUserManagementError(users);
