import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';

import constructPaginatedView from './constructPaginatedView';

const getSkillsFromAppState = (appState, evaluationId) =>
  R.path(['entities', 'evaluations', 'entities', evaluationId, 'skills'], appState);

const getFirstUnevaluatedSkill = (elements, skills) =>
  R.find(({ skillId }) => !skills[skillId].status.current)(elements);

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
  MOVE_TO_PREVIOUS_SKILL: null,
});

const initialValues = {
  evaluationId: '',
  paginatedView: [],
  currentSkill: {},
};

const init = createAction(
 actionTypes.SET_AS_CURRENT_EVALUATION,
  evaluation => evaluation
);

// TODO: Sort out naming here.
const moveToNextUnevaluatedSkill = createAction(
  actionTypes.MOVE_TO_NEXT_UNEVALUATED_SKILL,
  skills => skills
);

const moveToNextSkill = createAction(
  actionTypes.MOVE_TO_NEXT_SKILL
);

const moveToPrevSkill = createAction(
  actionTypes.MOVE_TO_PREVIOUS_SKILL
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
    return dispatch(init(evaluation));
  }
};

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

function prevSkill() {
  return function(dispatch) {
    return dispatch(moveToPrevSkill());
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
  prevSkill,
  nextUnevaluatedSkill,
  nextCategory,
  previousCategory,
};

export default handleActions({
  [init]: (state, action) => {
    const evaluation = action.payload;
    const paginatedView = constructPaginatedView(evaluation);
    const currentSkill = getFirstUnevaluatedSkill(paginatedView, evaluation.skills);
    const firstSkill = R.head(paginatedView);
    const firstCategory = firstSkill.category;
    const lastSkill = R.last(paginatedView);
    const lastCategory = lastSkill.category;

    const initialisedEvaluation = {
      evaluationId: evaluation.id,
      paginatedView,
      currentSkill,
      firstSkill,
      firstCategory,
      lastSkill,
      lastCategory
    };

    return Object.assign({}, state, initialisedEvaluation);
  },
  [moveToNextSkill]: (state) => {
    const { paginatedView, currentSkill: { skillId }, lastSkill } = state;

    if (skillId === lastSkill.skillId) {
      return state;
    }

    const indexOfCurrentSkill =  R.findIndex(R.propEq('skillId', skillId), paginatedView);
    const nextSkill = paginatedView[indexOfCurrentSkill + 1];

    return Object.assign({}, state, { currentSkill: nextSkill })
  },
  [moveToPrevSkill]: (state) => {
    const { paginatedView, currentSkill: { skillId }, firstSkill } = state;

    if (skillId === firstSkill.skillId) {
      return state;
    }

    const indexOfCurrentSkill =  R.findIndex(R.propEq('skillId', skillId), paginatedView);
    const prevSkill = paginatedView[indexOfCurrentSkill - 1];

    return Object.assign({}, state, { currentSkill: prevSkill })
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

export const getFirstSkill = (evaluation) =>
  R.path(['firstSkill'], evaluation);

export const getLastSkill = (evaluation) =>
  R.path(['lastSkill'], evaluation);
