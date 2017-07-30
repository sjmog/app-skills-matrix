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
  RETRIEVE_EVALUATION_SUCCESS: null,
  RETRIEVE_EVALUATION_FAILURE: null,
  SKILL_STATUS_UPDATE_SUCCESS: null,
  SKILL_STATUS_UPDATE_FAILURE: null,
  EVALUATION_COMPLETE_SUCCESS: null,
  EVALUATION_COMPLETE_FAILURE: null,
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
};

// TODO: Could have separate errs array now.
export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: (state, action) => {
    const skills = R.path(['payload', 'skills'], action);
    const entities = R.merge(state.entities, skills);
    return R.merge(state, { entities });
  },
  [updateSkillStatusSuccess]: (state, action) => {
    const { skillId, status } = action.payload;
    const skillLens = R.lensPath(['entities', skillId]);
    const skill = R.view(skillLens, state);

    const updatedSkill = {
      ...skill,
      status: { ...skill.status, current: status },
      error: null,
    };

    return R.set(skillLens, updatedSkill, state);
  },
  [updateSkillStatusFailure]: (state, action) => {
    const { skillId, error } = action.payload;
    const skillErrorLens = R.lensPath(['entities', skillId, 'error']);

    return R.set(skillErrorLens, error, state);
  },
}, initialState);

export const getSkill = (state, skillId) =>
  R.path(['entities', skillId], state);

export const getSkillStatus = (state, skillId) =>
  R.path(['entities', skillId, 'status'], state);
