import { combineReducers } from 'redux';
import { reducers as dashboardReducers } from './dashboard';
import { reducers as evaluationReducers } from './evaluation';

export const reducers = combineReducers({ dashboard: dashboardReducers, evaluation: evaluationReducers });
