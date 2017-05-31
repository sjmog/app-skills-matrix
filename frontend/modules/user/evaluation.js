import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';

import constructPaginatedView from './constructPaginatedView';

const getFirstUnevaluatedSkill = (elements, skills) =>
  R.find(({ skillId }) => {
    return !skills[skillId].status.current
  })(elements);

const getNextUnevaluatedSkill = (paginatedView, skills, currentSkillId) => {
  const indexOfCurrentSkill = R.findIndex(R.propEq('skillId', currentSkillId))(paginatedView);
  const remainingPaginatedView = R.slice(indexOfCurrentSkill, Infinity, paginatedView);

  return getFirstUnevaluatedSkill(remainingPaginatedView, skills);
};

export const actionTypes = keymirror({
  SET_AS_CURRENT_EVALUATION: null,
  MOVE_TO_NEXT_UNEVALUATED_SKILL: null,
  MOVE_TO_NEXT_UNEVALUATED_SKILL_V2: null,
  MOVE_TO_NEXT_CATEGORY: null,
  MOVE_TO_PREVIOUS_CATEGORY: null
});


const initialValues = {
  evaluationId: '',
  paginatedView: [],
  currentSkill: {},
};

const init = createAction(
 actionTypes.SET_AS_CURRENT_EVALUATION,
  (evaluationId, paginatedView, currentSkill) =>
    ({ evaluationId, paginatedView, currentSkill }) // Termainal?
);

const moveToSkill = createAction(
  actionTypes.MOVE_TO_NEXT_UNEVALUATED_SKILL, // TODO: Consider restructuring.
  skill => skill
);

const moveToSkillV2 = createAction(
  actionTypes.MOVE_TO_NEXT_UNEVALUATED_SKILL_V2,
  skills => skills
);

const moveToNextCategoryV = createAction(
  actionTypes.MOVE_TO_NEXT_CATEGORY,
  skills => skills
);

const moveToPreviousCategoryV = createAction(
  actionTypes.MOVE_TO_PREVIOUS_CATEGORY,
  skills => skills
);

function initEvaluation(evaluationId) {
  return function(dispatch, getState) {
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], getState());

    const evaluationView = constructPaginatedView(evaluation);
    const currentSkill = getFirstUnevaluatedSkill(evaluationView, evaluation.skills);
    const firstSkill = '';
    const firstCategory = '';
    const lastSkill = '';
    const lastCategory = '';


    return dispatch(init(evaluationId, evaluationView, currentSkill));
  }
};

// TODO: Could I use a selector here?
const getSkillsFromAppState = (appState, evaluationId) =>
  R.path(['entities', 'evaluations', 'entities', evaluationId, 'skills'], appState);

// TODO: What if a user hits next and there are no unattained skills? Current skill === last skill?
function moveToNextSkill(evaluationId) {
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(moveToSkillV2(skills));
  }
};

function moveToNextCategory(evaluationId) { // TODO: This is actually moving to the next category where there is an unevaluated skill.
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(moveToNextCategoryV(skills)); // TODO: May choose to say that if there are no unevaluated skills then we want to go to the last.
  }
};

function moveToPreviousCategory(evaluationId) { // TODO: What if current skill had category stored against it?
  return function(dispatch, getState) { // TODO: Look at some Redux docs to see how we can avoid calling get state all the time.
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(moveToPreviousCategoryV(skills));
  }
}

export const actions = {
  initEvaluation,
  moveToNextSkill,
  moveToNextCategory,
  moveToPreviousCategory,
};

export default handleActions({
  [init]: (state, action) => {
    return Object.assign({}, state, action.payload);
  },
  [moveToSkill]: (state, action) => {
    return Object.assign({}, state, { currentSkill: action.payload })
  },
  [moveToSkillV2]: (state, action) => {
    const { paginatedView, currentSkill: { skillId } } = state;
    const skills = action.payload;
    const currentSkill = getNextUnevaluatedSkill(paginatedView, skills, skillId);

    return Object.assign({}, state, { currentSkill })
  },
  [moveToNextCategoryV]: (state, action) => {
    const { paginatedView, currentSkill: { category } } = state;
    const skills = action.payload;
    const indexOfFirstElementInNextCategory = R.findLastIndex(R.propEq('category', category), paginatedView) + 1;
    const nextCategory = R.path(['category'], paginatedView[indexOfFirstElementInNextCategory]);
    const elements = R.filter(R.propEq('category', nextCategory), paginatedView);
    const currentSkill = getFirstUnevaluatedSkill(elements, skills) || R.last(elements);

    return Object.assign({}, state, { currentSkill })
  },
  [moveToPreviousCategoryV]: (state, action) => {
    const { paginatedView, currentSkill: { category } } = state;
    const skills = action.payload;
    const indexOfLastElementInPrevCategory = R.findIndex(R.propEq('category', category), paginatedView) - 1;
    const prevCategory = R.path(['category'], paginatedView[indexOfLastElementInPrevCategory]);
    const elements = R.filter(R.propEq('category', prevCategory), paginatedView);
    const currentSkill = getFirstUnevaluatedSkill(elements, skills) || R.last(elements);

    return Object.assign({}, state, { currentSkill })
  }

}, initialValues);

export const getCurrentEvaluation = (evaluation) =>
  R.path(['evaluationId'], evaluation);

export const getCurrentSkill = (evaluation) =>
  R.path(['currentSkill'], evaluation);