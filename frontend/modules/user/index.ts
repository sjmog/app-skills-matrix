import { combineReducers } from 'redux';
import user, * as fromUser from './user';
import evaluation, * as fromEvaluation from './evaluation';
import evaluations, * as fromEvaluations from './evaluations';
import skills, * as fromSkills from './skills';
import notes, * as fromNotes from './notes';
import users, * as fromUsers from './users';

const entities = combineReducers({ evaluations, skills, notes, users });

export default combineReducers({ user, entities, evaluation });

/* USER SELECTORS */

export const getLoggedInUsername = ({ user }) =>
  fromUser.getLoggedInUsername(user);

export const getLoggedInUserId = ({ user }) =>
  fromUser.getLoggedInUserId(user);

export const getFeedbackUrlForLatestEval = ({ user }) =>
  fromUser.getFeedbackUrlForLatestEval(user);

export const getObjectivesUrlForLatestEval = ({ user }) =>
  fromUser.getObjectivesUrlForLatestEval(user);

/* EVALUATION SELECTORS */

export const getCurrentEvaluation = ({ evaluation }) =>
  fromEvaluation.getCurrentEvaluation(evaluation);

export const getCurrentSkill = ({ evaluation }) =>
  fromEvaluation.getCurrentSkill(evaluation);

export const getCurrentSkillUid = ({ evaluation }) =>
  fromEvaluation.getCurrentSkillUid(evaluation);

export const getLastCategory = ({ evaluation }) =>
  fromEvaluation.getLastCategory(evaluation);

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

export const hasNotes = ({ entities: { skills } }, skillUid) =>
  fromSkills.hasNotes(skills, skillUid);

export const getSkillsWithCurrentStatus = ({ entities: { skills } }, status, skillUids) =>
  fromSkills.getSkillsWithCurrentStatus(skills, status, skillUids);

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

export const getNote = ({ entities: { notes } }, noteId) =>
  fromNotes.getNote(notes, noteId);

export const getNotesError = ({ entities: { notes } }) =>
  fromNotes.getNotesError(notes);

/* USERS SELECTORS */

export const getUser = ({ entities: { users } }, userId) =>
  fromUsers.getUser(users, userId);
