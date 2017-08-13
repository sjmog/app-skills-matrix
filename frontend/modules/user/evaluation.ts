import { handleActions, createAction } from 'redux-actions';
import * as keymirror from 'keymirror';
import * as R from 'ramda';

import constructPaginatedView from './constructPaginatedView';

const getEvalById = (state, evalId) => R.path(['entities', 'evaluations', 'entities', evalId], state);

const getSkillUids = evaluation => R.prop('skillUids', evaluation);

const getSkillDetails = (state, skillUids) => {
  const allSkills = R.path(['entities', 'skills', 'entities'], state);
  return R.pickAll(skillUids, allSkills);
};

const getFirstUnevaluatedSkill = (elements, skills) =>
  R.find(({ skillUid }) => !skills[skillUid].status.current)(elements) || R.last(elements);

const getNextUnevaluatedSkill = (paginatedView, skills, currentSkillUid) => {
  const indexOfCurrentSkill = R.findIndex(R.propEq('skillUid', currentSkillUid))(paginatedView);
  const remainingSkillsInPaginatedView = R.slice(indexOfCurrentSkill + 1, Infinity, paginatedView);

  return getFirstUnevaluatedSkill(remainingSkillsInPaginatedView, skills);
};

export const actionTypes = keymirror({
  SET_AS_CURRENT_EVALUATION: null,
  TERMINATE_EVALUATION: null,
  NEXT_UNEVALUATED_SKILL: null,
  NEXT_SKILL: null,
  PREVIOUS_SKILL: null,
  NEXT_CATEGORY: null,
  PREVIOUS_CATEGORY: null,
  SET_CURRENT_SKILL: null,
});

export const actions = {
  setAsCurrentEvaluation: createAction(actionTypes.SET_AS_CURRENT_EVALUATION, (evaluation, skills) => ({ evaluation, skills })),
  terminateEvaluation: createAction(actionTypes.TERMINATE_EVALUATION),
  nextUnevaluatedSkill: createAction(actionTypes.NEXT_UNEVALUATED_SKILL, skills => skills),
  nextSkill: createAction(actionTypes.NEXT_SKILL),
  previousSkill: createAction(actionTypes.PREVIOUS_SKILL),
  nextCategory: createAction(actionTypes.NEXT_CATEGORY, skills => skills),
  previousCategory: createAction(actionTypes.PREVIOUS_CATEGORY, skills => skills),
  setCurrentSkill: createAction(actionTypes.SET_CURRENT_SKILL, skillUid => skillUid),
};

function initEvaluation(evaluationId) {
  return (dispatch, getState) => {
    const state = getState();
    const evaluation = getEvalById(state, evaluationId);
    const skills = getSkillDetails(state, getSkillUids(evaluation));
    return dispatch(actions.setAsCurrentEvaluation(evaluation, skills));
  };
}

function terminateEvaluation() {
  return actions.terminateEvaluation();
}

function nextUnevaluatedSkill(evaluationId) {
  return (dispatch, getState) => {
    const state = getState();
    const evaluation = getEvalById(state, evaluationId);
    const skills = getSkillDetails(state, getSkillUids(evaluation));
    return dispatch(actions.nextUnevaluatedSkill(skills));
  };
}

function nextSkill() {
  return actions.nextSkill();
}

function prevSkill() {
  return actions.previousSkill();
}

function nextCategory(evaluationId) {
  return (dispatch, getState) => {
    const state = getState();
    const evaluation = getEvalById(state, evaluationId);
    const skills = getSkillDetails(state, getSkillUids(evaluation));
    return dispatch(actions.nextCategory(skills));
  };
}

function previousCategory(evaluationId) {
  return (dispatch, getState) => {
    const state = getState();
    const evaluation = getEvalById(state, evaluationId);
    const skills = getSkillDetails(state, getSkillUids(evaluation));
    return dispatch(actions.previousCategory(skills));
  };
}

export const actionCreators = {
  initEvaluation,
  terminateEvaluation,
  nextSkill,
  prevSkill,
  nextUnevaluatedSkill,
  nextCategory,
  previousCategory,
};

export const initialState = {
  evaluationId: '',
  paginatedView: [],
  currentSkill: null,
  firstSkill: null,
  lastSkill: null,
  firstCategory: '',
  lastCategory: '',
};

export default handleActions({
  [actions.setAsCurrentEvaluation]: (state, action) => {
    const { evaluation, skills } = action.payload;
    const skillGroups = R.path(['skillGroups'], evaluation);
    const levels = R.path(['template', 'levels'], evaluation);
    const categories = R.path(['template', 'categories'], evaluation);

    const paginatedView = constructPaginatedView(skills, skillGroups, levels, categories);
    const currentSkill = getFirstUnevaluatedSkill(paginatedView, skills);
    const firstSkill = R.head(paginatedView) as any; // TODO fixme
    const firstCategory = firstSkill.category;
    const lastSkill = R.last(paginatedView) as any; // TODO fixme
    const lastCategory = lastSkill.category;

    const initialisedEvaluation = {
      evaluationId: evaluation.id,
      paginatedView,
      currentSkill,
      firstSkill,
      firstCategory,
      lastSkill,
      lastCategory,
    };

    return Object.assign({}, state, initialisedEvaluation);
  },
  [actions.terminateEvaluation]: () => initialState,
  [actions.nextSkill]: (state) => {
    const { paginatedView, currentSkill, lastSkill } = state;

    if (currentSkill.skillUid === lastSkill.skillUid) {
      return state;
    }

    const indexOfCurrentSkill = R.findIndex(R.propEq('skillUid', currentSkill.skillUid), paginatedView);
    const nextSkill = paginatedView[indexOfCurrentSkill + 1];

    return Object.assign({}, state, { currentSkill: nextSkill });
  },
  [actions.previousSkill]: (state) => {
    const { paginatedView, currentSkill: { skillUid }, firstSkill } = state;

    if (skillUid === firstSkill.skillUid) {
      return state;
    }

    const indexOfCurrentSkill = R.findIndex(R.propEq('skillUid', skillUid), paginatedView);
    const prevSkill = paginatedView[indexOfCurrentSkill - 1];

    return Object.assign({}, state, { currentSkill: prevSkill });
  },
  [actions.nextUnevaluatedSkill]: (state, action) => {
    const { paginatedView, currentSkill: { skillUid } } = state;

    const skills = action.payload;
    const currentSkill = getNextUnevaluatedSkill(paginatedView, skills, skillUid) || R.last(paginatedView);
    return Object.assign({}, state, { currentSkill });
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

    return Object.assign({}, state, { currentSkill });
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

    return Object.assign({}, state, { currentSkill });
  },
  [actions.setCurrentSkill]: (state, action) => {
    const { paginatedView } = state;
    const currentSkill = R.find(R.propEq('skillUid', action.payload))(paginatedView);
    return Object.assign({}, state, { currentSkill });
  },
}, initialState);

export const getCurrentEvaluation = evaluation =>
  R.path(['evaluationId'], evaluation);

export const getCurrentSkill = evaluation =>
  R.path(['currentSkill'], evaluation);

export const getCurrentSkillUid = evaluation =>
  R.path(['currentSkill', 'skillUid'], evaluation);

export const getFirstCategory = evaluation =>
  R.path(['firstCategory'], evaluation);

export const getLastCategory = evaluation =>
  R.path(['lastCategory'], evaluation);

export const getFirstSkill = evaluation =>
  R.path(['firstSkill'], evaluation);

export const getLastSkill = evaluation =>
  R.path(['lastSkill'], evaluation);
