import { combineReducers } from 'redux';
import dashboard from './dashboard';
import evaluation, * as fromEvaluation from './evaluation';

export const reducers = combineReducers({ dashboard, evaluation });

export const getAllSkillsInCategory = (state, category) =>
  fromEvaluation.getAllSkillsInCategory(state.evaluation, category);