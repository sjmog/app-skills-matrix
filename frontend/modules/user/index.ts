import { combineReducers } from 'redux';
import user, * as fromUser from './user';
import evaluation, * as fromEvaluation from './evaluation';
import evaluations, * as fromEvaluations from './evaluations';
import skills, * as fromSkills from './skills';
import actions, * as fromActions from './actions';
import notes, * as fromNotes from './notes';

const entities = combineReducers({ evaluations, skills, notes });

export default combineReducers({ user, entities, actions, evaluation });

/* USER SELECTORS */

export const getUsername = ({ user }) =>
  fromUser.getUsername(user);

/* EVALUATION SELECTORS */

export const getCurrentEvaluation = ({ evaluation }) =>
  fromEvaluation.getCurrentEvaluation(evaluation);

export const getCurrentSkill = ({ evaluation }) =>
  fromEvaluation.getCurrentSkill(evaluation);

export const getCurrentSkillUid = ({ evaluation }) =>
  fromEvaluation.getCurrentSkillUid(evaluation);

export const getFirstCategory = ({ evaluation }) =>
  fromEvaluation.getFirstCategory(evaluation);

export const getLastCategory = ({ evaluation }) =>
  fromEvaluation.getLastCategory(evaluation);

export const getFirstSkill = ({ evaluation }) =>
  fromEvaluation.getFirstSkill(evaluation);

export const getLastSkill = ({ evaluation }) =>
  fromEvaluation.getLastSkill(evaluation);


/* SKILLS SELECTORS */

export const getSkillStatus = ({ entities: { skills } }, skillUid) =>
  fromSkills.getSkillStatus(skills, skillUid);

export const getSkill = ({ entities: { skills } }, skillUid) =>
  fromSkills.getSkill(skills, skillUid);

export const getErringSkills = ({ entities: { skills } }, skillUids) =>
  fromSkills.getErringSkills(skills, skillUids);

export const getSkillError = ({ entities: { skills } }, skillUid) =>
  fromSkills.getSkillError(skills, skillUid);

export const getNotesForSkill = ({ entities: { skills } }, skillUid) =>
  fromSkills.getNotesForSkill(skills, skillUid);

/* EVALUATIONS SELECTORS */

export const getSubjectName = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getSubjectName(evaluations, evalId);

export const getEvaluationName = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getEvaluationName(evaluations, evalId);

export const getEvaluationFetchStatus = ({ entities: { evaluations } }, category) =>
  fromEvaluations.getEvaluationFetchStatus(evaluations, category);

export const getView = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getView(evaluations, evalId);

export const getEvaluationStatus = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getEvaluationStatus(evaluations, evalId);

export const getSkillGroups = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getSkillGroups(evaluations, evalId);

export const getLevels = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getLevels(evaluations, evalId);

export const getCategories = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getCategories(evaluations, evalId);

export const getError = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getError(evaluations, evalId);

export const getSkillGroupsWithReversedSkills = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getSkillGroupsWithReversedSkills(evaluations, evalId);

export const getSkillUids = ({ entities: { evaluations } }, evalId) =>
  fromEvaluations.getSkillUids(evaluations, evalId);

/* NOTES SELECTORS */

export const getNotes = ({ entities: { notes } }, noteIds) =>
  fromNotes.getNotes(notes, noteIds);

export const getNotesError = ({ entities: { notes } }) =>
  fromNotes.getNotesError(notes);

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
