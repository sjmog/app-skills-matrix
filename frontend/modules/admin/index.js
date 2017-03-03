import { combineReducers } from 'redux';

import { reducers as manageUsersReducers } from './manageUsers';
import { reducers as manageMatricesReducers } from './manageMatrices';

export const reducers = combineReducers({ manageUsers: manageUsersReducers, manageMatrices: manageMatricesReducers });
