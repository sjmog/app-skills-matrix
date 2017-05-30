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

function moveToNextCategory(currentSkillId, evaluationId) {
  return function(dispatch, getState) {
    const appState = getState();
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], appState);
    const paginatedView = R.path(['evaluation', 'paginatedView'], appState);
    const currentSkillDetails = R.find(R.propEq('skillId', currentSkillId), paginatedView); // TODO: Could pass in the current category.
    const indexOfLastSkillInCurrentCategory = R.findLastIndex(R.propEq('category', currentSkillDetails.category), paginatedView);
    const remainingElements = R.slice(indexOfLastSkillInCurrentCategory + 1, Infinity, paginatedView);
    const nextUnevaluatedSkill = getFirstUnevaluatedSkill(remainingElements, evaluation.skills);
    return dispatch(moveToSkill(nextUnevaluatedSkill))
  }
};

export const actions = {
  initEvaluation,
  moveToNextSkill,
  moveToNextCategory,
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