import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';

const constructEvaluationView = (evaluation) => {
  const skillGroups = R.path(['skillGroups'], evaluation);
  const levels = R.path(['template', 'levels'], evaluation);
  const categories = R.path(['template', 'categories'], evaluation);

  const category = skillGroup => skillGroup.category;

  const sortByLevel = (category) => {
    const indexOfLevel = (a, b) => levels.indexOf(a.level) > levels.indexOf(b.level);
    return R.sort(indexOfLevel)(R.values(category));
  };

  const assignSkillGroupIdToSkills = ({ id: skillGroupId, skills }) =>
    R.map((skillId) => ({ skillId, skillGroupId }))(skills);

  const sortByCategoryOrder = obj =>
    R.reduce((acc, curr) => [].concat(acc, obj[curr]), [])(categories);

  return R.compose(
    R.flatten,
    R.map(assignSkillGroupIdToSkills),
    sortByCategoryOrder,
    R.map(sortByLevel),
    R.groupBy(category),
    R.values
  )(skillGroups);
};

const getFirstUnevaluatedSkill = (elements, skills) =>
  R.find(({ skillId }) => !skills[skillId].status.current)(elements);

export const actionTypes = keymirror({
  SET_AS_CURRENT_EVALUATION: null,
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

function initEvaluation(evaluationId) {
  return function(dispatch, getState) {
    const evaluation = R.path(['entities', 'evaluations', 'entities', evaluationId], getState());

    const evaluationView = constructEvaluationView(evaluation);
    const currentSkill = getFirstUnevaluatedSkill(evaluationView, evaluation.skills);

    return dispatch(init(evaluationId, evaluationView, currentSkill));
  }
};

export const actions = {
  initEvaluation,
};

export default handleActions({
  [init]: (state, action) => {
    return Object.assign({}, state, action.payload);
  }
}, initialValues);

export const getCurrentEvaluation = (evaluation) =>
  R.path(['evaluationId'], evaluation);

export const getCurrentSkill = (evaluation) =>
  R.path(['currentSkill'], evaluation);