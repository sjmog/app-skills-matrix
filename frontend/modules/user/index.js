import { combineReducers } from 'redux';
import { reducers as dashboardReducers } from './dashboard';

export const reducers = combineReducers({ dashboard: dashboardReducers });
