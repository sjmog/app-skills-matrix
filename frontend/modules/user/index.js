import { combineReducers } from 'redux';
import dashboard from './dashboard';
import evaluation, * as fromEvaluation from './evaluation';

export const reducers = combineReducers({ dashboard, evaluation });

// EVALUATION SELECTORS

export const getAllSkillsInCategory = ({ evaluation }, category) =>
  fromEvaluation.getAllSkillsInCategory(evaluation, category);

export const getView = ({ evaluation }) =>
  fromEvaluation.getView(evaluation);

export const getTemplateName = ({ evaluation }) =>
  fromEvaluation.getTemplateName(evaluation);

export const getFirstCategory = ({ evaluation }) =>
  fromEvaluation.getFirstCategory(evaluation);

export const getSubjectName = ({ evaluation }) =>
  fromEvaluation.getSubjectName(evaluation);

export const getEvaluationStatus = ({ evaluation}) =>
  fromEvaluation.getEvaluationStatus(evaluation);