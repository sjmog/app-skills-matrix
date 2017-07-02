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
  const remainingPaginatedView = R.slice(indexOfCurrentSkill + 1, Infinity, paginatedView);

  return getFirstUnevaluatedSkill(remainingPaginatedView, skills);
};

export const actionTypes = keymirror({
  SET_AS_CURRENT_EVALUATION: null,
  NEXT_UNEVALUATED_SKILL: null,
  NEXT_SKILL: null,
  PREVIOUS_SKILL: null,
  NEXT_CATEGORY: null,
  PREVIOUS_CATEGORY: null,
});

export const actions = {
  setAsCurrentEvaluation: createAction(actionTypes.SET_AS_CURRENT_EVALUATION, evaluation => evaluation),
  nextUnevaluatedSkill: createAction(actionTypes.NEXT_UNEVALUATED_SKILL, skills => skills),
  nextSkill: createAction(actionTypes.NEXT_SKILL),
  previousSkill: createAction(actionTypes.PREVIOUS_SKILL),
  nextCategory: createAction(actionTypes.NEXT_CATEGORY, skills => skills),
  previousCategory: createAction(actionTypes.PREVIOUS_CATEGORY, skills => skills),
};

function initEvaluation(evaluationId) {
  return function(dispatch, getState) {
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], getState());
    return dispatch(actions.setAsCurrentEvaluation(evaluation));
  }
}

function nextUnevaluatedSkill(evaluationId) {
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(actions.nextUnevaluatedSkill(skills));
  }
}

function nextSkill() {
  return function(dispatch) {
    return dispatch(actions.nextSkill());
  }
}

function prevSkill() {
  return function(dispatch) {
    return dispatch(actions.previousSkill());
  }
}

function nextCategory(evaluationId) {
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(actions.nextCategory(skills));
  }
}

function previousCategory(evaluationId) {
  return function(dispatch, getState) {
    const skills = getSkillsFromAppState(getState(), evaluationId);
    return dispatch(actions.previousCategory(skills));
  }
}

export const actionCreators = {
  initEvaluation,
  nextSkill,
  prevSkill,
  nextUnevaluatedSkill,
  nextCategory,
  previousCategory,
};

export const initialValues = {
  evaluationId: '',
  paginatedView: [],
  currentSkill: {},
};

export default handleActions({
  [actions.setAsCurrentEvaluation]: (state, action) => {
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
  [actions.nextSkill]: (state) => {
    const { paginatedView, currentSkill, lastSkill } = state;

    if (currentSkill.skillId === lastSkill.skillId) {
      return state;
    }

    const indexOfCurrentSkill =  R.findIndex(R.propEq('skillId', currentSkill.skillId), paginatedView);
    const nextSkill = paginatedView[indexOfCurrentSkill + 1];

    return Object.assign({}, state, { currentSkill: nextSkill })
  },
  [actions.previousSkill]: (state) => {
    const { paginatedView, currentSkill: { skillId }, firstSkill } = state;

    if (skillId === firstSkill.skillId) {
      return state;
    }

    const indexOfCurrentSkill =  R.findIndex(R.propEq('skillId', skillId), paginatedView);
    const prevSkill = paginatedView[indexOfCurrentSkill - 1];

    return Object.assign({}, state, { currentSkill: prevSkill })
  },
  [actions.nextUnevaluatedSkill]: (state, action) => {
    const { paginatedView, currentSkill: { skillId } } = state;

    const skills = action.payload;
    const currentSkill = getNextUnevaluatedSkill(paginatedView, skills, skillId) || R.last(paginatedView);
    return Object.assign({}, state, { currentSkill })
  },
  [actions.nextCategory]: (state, action) => {
    const { paginatedView, currentSkill: { category }, lastCategory } = state;

    if (category === lastCategory) {
      return state;
    }

    const skills = action.payload;
    const indexOfFirstElementInNextCategory = R.findLastIndex(R.propEq('category', category), paginatedView) + 1;
    const nextCategory = R.path(['category'], paginatedView[indexOfFirstElementInNextCategory]);
    const elements = R.filter(R.propEq('category', nextCategory), paginatedView);
    const currentSkill = getFirstUnevaluatedSkill(elements, skills) || R.last(elements);

    return Object.assign({}, state, { currentSkill })
  },
  [actions.previousCategory]: (state, action) => {
    const { paginatedView, currentSkill: { category }, firstCategory } = state;

    if (category === firstCategory) {
      return state;
    }

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
