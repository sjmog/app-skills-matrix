import { handleActions } from 'redux-actions';
import R from 'ramda';
import { actions as evaluationsActions } from './evaluations';

const initialState = {
  entities: {},
};

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: (state, action) => {
    const skills = R.path(['payload', 'skills'], action);
    const entities = R.merge(state.entities, skills);
    return R.merge(state, { entities });
  },
}, initialState);

export const getSkill = (state, skillId) =>
  R.path(['entities', skillId], state);

export const getSkillStatus = (state, skillId) =>
  R.path(['entities', skillId, 'status'], state);
