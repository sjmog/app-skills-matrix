import { combineReducers } from 'redux';
import { reducers as dashboardReducers } from './dashboard';
import { reducers as manageEvaluationReducers } from './manageEvaluation';

export const reducers = combineReducers({ dashboard: dashboardReducers, manageEvaluation: manageEvaluationReducers });
