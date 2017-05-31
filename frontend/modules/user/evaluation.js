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
});


const initialValues = {
  evaluationId: '',
  paginatedView: [],
  currentSkill: {},
};

const init = createAction(
 actionTypes.SET_AS_CURRENT_EVALUATION,
  (evaluationId, paginatedView, currentSkill) =>
    ({ evaluationId, paginatedView, currentSkill })
);

const moveToSkill = createAction(
  actionTypes.MOVE_TO_NEXT_UNEVALUATED_SKILL, // TODO: Consider restructuring.
  skill => skill
);

function initEvaluation(evaluationId) {
  return function(dispatch, getState) {
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], getState());

    const evaluationView = constructPaginatedView(evaluation);
    const currentSkill = getFirstUnevaluatedSkill(evaluationView, evaluation.skills);

    return dispatch(init(evaluationId, evaluationView, currentSkill));
  }
};

function moveToNextSkill(currentSkillId, evaluationId) { // TODO: Is it right to pass in these values?
  return function(dispatch, getState) {
    const appState = getState();
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], appState);
    const paginatedView = R.path(['evaluation', 'paginatedView'], appState);
    const nextUnevaluatedSkill = getNextUnevaluatedSkill(paginatedView, evaluation.skills, currentSkillId);
    return dispatch(moveToSkill(nextUnevaluatedSkill));
  }
};

function moveToNextCategory(currentSkillId, evaluationId) { // TODO: This is actually moving to the next category where there is an unevaluated skill.
  return function(dispatch, getState) {
    const appState = getState();
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], appState);
    const paginatedView = R.path(['evaluation', 'paginatedView'], appState);
    const currentSkillDetails = R.find(R.propEq('skillId', currentSkillId), paginatedView); // TODO: Could pass in the current category.
    const indexOfLastSkillInCurrentCategory = R.findLastIndex(R.propEq('category', currentSkillDetails.category), paginatedView);
    const remainingElements = R.slice(indexOfLastSkillInCurrentCategory + 1, Infinity, paginatedView);
    const nextUnevaluatedSkill = getFirstUnevaluatedSkill(remainingElements, evaluation.skills);
    return dispatch(moveToSkill(nextUnevaluatedSkill)); // TODO: May choose to say that if there are no unevaluated skills then we want to go to the last.
  }
};

function moveToPreviousCategory(currentSkillId, evaluationId) { // TODO: What if current skill had category stored against it?
  return function(dispatch, getState) { // TODO: Look at some Redux docs to see how we can avoid calling get state all the time.
    const appState = getState();
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], appState);
    const paginatedView = R.path(['evaluation', 'paginatedView'], appState);
    const currentSkillDetails = R.find(R.propEq('skillId', currentSkillId), paginatedView);
    const indexOfFirstSkillInCurrentCategory = R.findIndex(R.propEq('category', currentSkillDetails.category), paginatedView);
    const lastSkillInPreviousCategory = paginatedView[indexOfFirstSkillInCurrentCategory - 1]; // TODO: What about first and last elements? Look at descend.
    const firstSkillInPreviousCategory = R.findIndex(R.propEq('category', lastSkillInPreviousCategory.category), paginatedView);
    const elementsInPreviousCategory = R.slice(firstSkillInPreviousCategory, indexOfFirstSkillInCurrentCategory - 1, paginatedView);
    const firstUnevaluatedSkillInPreviousCategory = getFirstUnevaluatedSkill(elementsInPreviousCategory, evaluation.skills);

    return firstUnevaluatedSkillInPreviousCategory
      ? dispatch(moveToSkill(firstUnevaluatedSkillInPreviousCategory))
      : dispatch(moveToSkill(lastSkillInPreviousCategory));
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
  [moveToSkill]: (state, action ) => {
    return Object.assign({}, state, { currentSkill: action.payload })
  },
}, initialValues);

export const getCurrentEvaluation = (evaluation) =>
  R.path(['evaluationId'], evaluation);

export const getCurrentSkill = (evaluation) =>
  R.path(['currentSkill'], evaluation);