import { combineReducers } from 'redux';
import user from './user';
import evaluation, * as fromEvaluation from './evaluation';
import actions, * as fromActions from './actions';

export default combineReducers({ user, evaluation, actions });

/* EVALUATION SELECTORS */

export const getIdOfEvaluationInState = ({ evaluation }) =>
  fromEvaluation.getIdOfEvaluationInState(evaluation);

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

/* ACTIONS SELECTORS */

export const getFeedbackForEvaluation = ({ actions }, evaluationId) =>
  fromActions.getFeedbackForEvaluation(actions, evaluationId);

export const getFeedbackRetrievedStatus = ({ actions }) =>
  fromActions.getFeedbackRetrievedStatus(actions);

export const getFeedbackError = ({ actions }) =>
  fromActions.getFeedbackError(actions);

export const geObjectivesForEvaluation = ({ actions }, evaluationId) =>
  fromActions.geObjectivesForEvaluation(actions, evaluationId);

export const getObjectivesRetrievedStatus = ({ actions }) =>
  fromActions.getObjectivesRetrievedStatus(actions);

export const getObjectivesError = ({ actions }) =>
  fromActions.getObjectivesError(actions);