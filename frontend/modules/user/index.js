import { combineReducers } from 'redux';
import dashboard from './dashboard';
import evaluation, * as fromEvaluation from './evaluation';
import actions from './actions';

export default combineReducers({ dashboard, evaluation, actions });

/* EVALUATION SELECTORS */

export const getRetrievedStatus = ({ evaluation }) =>
  fromEvaluation.getRetrievedStatus(evaluation);

export const getAllSkillsInCategory = ({ evaluation }, category) =>
  fromEvaluation.getAllSkillsInCategory(evaluation, category);

export const getView = ({ evaluation }) =>
  fromEvaluation.getView(evaluation);

export const getTemplateName = ({ evaluation }) =>
  fromEvaluation.getTemplateName(evaluation);

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

export const getLowestUnevaluatedSkill = ({ evaluation }, category) =>
  fromEvaluation.getLowestUnevaluatedSkill(evaluation, category);

export const getErringSkills = ({ evaluation }) =>
  fromEvaluation.getErringSkills(evaluation);

export const getNextCategory = ({ evaluation }, category) =>
  fromEvaluation.getNextCategory(evaluation, category);
