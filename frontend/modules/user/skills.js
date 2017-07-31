import { handleActions, createAction } from 'redux-actions';
import R from 'ramda';
import keymirror from 'keymirror';

import { actions as evaluationsActions } from './evaluations';
import api from '../../api';

export const EVALUATION_VIEW = keymirror({
  MENTOR: null,
  SUBJECT: null,
  ADMIN: null,
});

export const actionTypes = keymirror({
  SKILL_STATUS_UPDATE_SUCCESS: null,
  SKILL_STATUS_UPDATE_FAILURE: null,
});

const updateSkillStatusSuccess = createAction(
  actionTypes.SKILL_STATUS_UPDATE_SUCCESS,
  (skillId, status) => ({ skillId, status }),
);

const updateSkillStatusFailure = createAction(
  actionTypes.SKILL_STATUS_UPDATE_FAILURE,
  (skillId, error) => ({ skillId, error }),
);

function updateSkillStatus(evaluationView, evaluationId, updateId, status, skillId) {
  return (dispatch, getState) => {
    const skillGroups = R.path(['entities', 'evaluations', 'entities', evaluationId, 'skillGroups'], getState());
    const skillGroupId = R.keys(R.filter(group => R.contains(updateId, group.skills), skillGroups))[0];

    let updateSkillFn;
    if (evaluationView === EVALUATION_VIEW.MENTOR) {
      updateSkillFn = api.mentorUpdateSkillStatus;
    } else if (evaluationView === EVALUATION_VIEW.SUBJECT) {
      updateSkillFn = api.subjectUpdateSkillStatus;
    } else if (evaluationView === EVALUATION_VIEW.ADMIN) {
      updateSkillFn = api.adminUpdateSkillStatus;
    } else {
      updateSkillFn = () => Promise.reject(new Error('Unknown user role'));
    }

    return updateSkillFn(evaluationId, skillGroupId, updateId, status)
      .then(() => dispatch(updateSkillStatusSuccess(skillId, status)))
      .catch(error => dispatch(updateSkillStatusFailure(skillId, error)));
  };
}

export const actionCreators = {
  updateSkillStatus,
};

const initialState = {
  entities: {},
  errors: {},
};

const errorsLens = R.lensPath(['errors']);

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: (state, action) => {
    const skills = R.path(['payload', 'skills'], action);
    const entities = R.merge(state.entities, skills);
    return R.merge(state, { entities });
  },
  [updateSkillStatusSuccess]: (state, action) => {
    const { skillId, status } = action.payload;
    const currentSkillStatusLens = R.lensPath(['entities', skillId, 'status', 'current']);

    return R.compose(
      R.set(errorsLens, R.omit([skillId], state.errors)),
      R.set(currentSkillStatusLens, status),
    )(state);
  },
  [updateSkillStatusFailure]: (state, action) => {
    const { skillId, error } = action.payload;
    const errorMsg = R.prop('message', error) || 'unknown';
    const errorLens = R.lensPath(['errors', skillId]);

    return R.set(errorLens, errorMsg, state);
  },
}, initialState);

export const getSkill = (state, skillId) =>
  R.path(['entities', skillId], state);

export const getSkillError = (state, skillId) =>
  R.path(['errors', skillId], state);

export const getSkillStatus = (state, skillId) =>
  R.path(['entities', skillId, 'status'], state);

export const getErringSkills = (state, skillIds) => {
  const skillOfInterest = skillId => R.contains(skillId, skillIds);
  const name = skillId => R.prop('name', getSkill(state, skillId));

  return R.compose(
    R.map(name),
    R.filter(skillOfInterest),
    R.keys,
    R.prop('errors'),
  )(state);
};
