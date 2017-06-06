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
  MOVE_TO_NEXT_CATEGORY: null,
  MOVE_TO_PREVIOUS_CATEGORY: null,
  MOVE_TO_NEXT_SKILL: null,
});

const initialValues = {
  evaluationId: '',
  paginatedView: [],
  currentSkill: {},
};

const init = createAction(
 actionTypes.SET_AS_CURRENT_EVALUATION,
  (evaluationId, paginatedView, currentSkill, firstSkill, firstCategory, lastSkill, lastCategory) =>
    ({ evaluationId, paginatedView, currentSkill, firstSkill, firstCategory, lastSkill, lastCategory })
);

// TODO: Sort out naming here.
const moveToNextUnevaluatedSkill = createAction(
  actionTypes.MOVE_TO_NEXT_UNEVALUATED_SKILL,
  skills => skills
);

const moveToNextSkill = createAction(
  actionTypes.MOVE_TO_NEXT_SKILL
);

const moveToNextCategory = createAction(
  actionTypes.MOVE_TO_NEXT_CATEGORY,
  skills => skills
);

const moveToPreviousCategory = createAction(
  actionTypes.MOVE_TO_PREVIOUS_CATEGORY,
  skills => skills
);

function initEvaluation(evaluationId) {
  return function(dispatch, getState) {
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], getState());
    const evaluationView = constructPaginatedView(evaluation);
    const currentSkill = getFirstUnevaluatedSkill(evaluationView, evaluation.skills);
    const firstSkill = R.head(evaluationView);
    const firstCategory = firstSkill.category;
    const lastSkill = R.last(evaluationView);
    const lastCategory = lastSkill.category;

    return dispatch(init(evaluationId, evaluationView, currentSkill, firstSkill, firstCategory, lastSkill, lastCategory));
  }
};

// TODO: Could I use a selector here?
const getSkillsFromAppState = (appState, evaluationId) =>
  R.path(['entities', 'evaluations', 'entities', evaluationId, 'skills'], appState);

function nextUnevaluatedSkill(evaluationId) {
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(moveToNextUnevaluatedSkill(skills));
  }
};

function nextSkill() {
  return function(dispatch) {
    return dispatch(moveToNextSkill());
  }
}

function nextCategory(evaluationId) {
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(moveToNextCategory(skills));
  }
};

function previousCategory(evaluationId) {
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(moveToPreviousCategory(skills));
  }
}

export const actions = {
  initEvaluation,
  nextSkill,
  nextUnevaluatedSkill,
  nextCategory,
  previousCategory,
};

export default handleActions({
  [init]: (state, action) => {
    return Object.assign({}, state, action.payload);
  },
  [moveToNextSkill]: (state) => {
    const { paginatedView, currentSkill: { skillId } } = state;
    const indexOfCurrentSkill =  R.findIndex(R.propEq('skillId', skillId), paginatedView);
    const nextSkill = paginatedView[indexOfCurrentSkill + 1];

    return Object.assign({}, state, { currentSkill: nextSkill })
  },
  [moveToNextUnevaluatedSkill]: (state, action) => {
    const { paginatedView, currentSkill: { skillId }, lastSkill } = state;

    if (skillId === lastSkill.skillId) {
      return state;
    }

    const skills = action.payload;
    const currentSkill = getNextUnevaluatedSkill(paginatedView, skills, skillId) || R.last(paginatedView);

    return Object.assign({}, state, { currentSkill })
  },
  [moveToNextCategory]: (state, action) => {
    const { paginatedView, currentSkill: { category } } = state;
    const skills = action.payload;
    const indexOfFirstElementInNextCategory = R.findLastIndex(R.propEq('category', category), paginatedView) + 1;
    const nextCategory = R.path(['category'], paginatedView[indexOfFirstElementInNextCategory]);
    const elements = R.filter(R.propEq('category', nextCategory), paginatedView);
    const currentSkill = getFirstUnevaluatedSkill(elements, skills) || R.last(elements);

    return Object.assign({}, state, { currentSkill })
  },
  [moveToPreviousCategory]: (state, action) => {
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

export const getFirstCategory = (evaluation) =>
  R.path(['firstCategory'], evaluation);

export const getLastCategory = (evaluation) =>
  R.path(['lastCategory'], evaluation);