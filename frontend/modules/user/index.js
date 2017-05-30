import { combineReducers } from 'redux';
import user, * as fromUser  from './user';
import evaluation, * as fromEvaluation from './evaluation';
import evaluations, * as fromEvaluations from './evaluations';
import actions, * as fromActions from './actions';

const entities = combineReducers({ evaluations });

export default combineReducers({ user, entities, actions, evaluation });

/* USER SELECTORS */

export const getUsername = ({ user }) =>
  fromUser.getUsername(user);

/* EVALUATION SELECTORS */

export const getCurrentEvaluation = ({ evaluation }) =>
  fromEvaluation.getCurrentEvaluation(evaluation);

export const getCurrentSkill = ({ evaluation }) =>
  fromEvaluation.getCurrentSkill(evaluation);

/* EVALUATIONS SELECTORS */

export const getCurrentSkillStatus = ({ entities: { evaluations } }, skillId, evalId) =>
  fromEvaluations.getCurrentSkillStatus(evaluations,skillId, evalId);

export const getSubjectName = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getSubjectName(evaluations, evalId);

export const getEvaluationName = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getEvaluationName(evaluations, evalId);

export const getEvaluationFetchStatus = ({ entities: { evaluations } }, category) =>
  fromEvaluations.getEvaluationFetchStatus(evaluations, category);

export const getAllSkillsInCategory = ({ evaluation }, category) =>
  fromEvaluations.getAllSkillsInCategory(evaluation, category);

export const getView = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getView(evaluations, evalId);

export const getTemplateName = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getTemplateName(evaluations, evalId);

export const getEvaluationStatus = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getEvaluationStatus(evaluations, evalId);

export const getSkillGroups = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getSkillGroups(evaluations, evalId);

export const getSkills = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getSkills(evaluations, evalId);

export const getLevels = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getLevels(evaluations, evalId);

export const getCategories = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getCategories(evaluations, evalId);

export const getError = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getError(evaluations, evalId);

export const getLowestUnevaluatedSkill = ({ evaluation }, category) =>
  fromEvaluations.getLowestUnevaluatedSkill(evaluation, category);

export const getErringSkills = ({ evaluation }) =>
  fromEvaluations.getErringSkills(evaluation);

export const getNextCategory = ({ entities: { evaluations } }, category, evalId) =>
  fromEvaluations.getNextCategory(evaluations, category, evalId);

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