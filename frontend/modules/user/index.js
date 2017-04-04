import { combineReducers } from 'redux';
import dashboard from './dashboard';
import evaluation, * as fromEvaluation from './evaluation';

export default combineReducers({ dashboard, evaluation });

/* EVALUATION SELECTORS */

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

export const getSkillGroups = ({ evaluation }) =>
  fromEvaluation.getSkillGroups(evaluation);

export const getSkills = ({ evaluation }) =>
  fromEvaluation.getSkills(evaluation);

export const getLevels = ({ evaluation }) =>
  fromEvaluation.getLevels(evaluation);

export const getCategories = ({ evaluation }) =>
  fromEvaluation.getCategories(evaluation);

export const getError = ({ evaluation }) =>
  fromEvaluation.getError(evaluation);
