import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';
import * as keymirror from 'keymirror';

import { actions as evaluationsActions } from './evaluations';
import { actions as noteActions } from './notes';

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
  (skillUid, status) => ({ skillUid, status }),
);

const updateSkillStatusFailure = createAction(
  actionTypes.SKILL_STATUS_UPDATE_FAILURE,
  (skillUid, error) => ({ skillUid, error }),
);

function updateSkillStatus(evaluationView, evaluationId, skillId, status, skillUid) {
  return (dispatch) => {
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

    return updateSkillFn(evaluationId, skillId, status)
      .then(() => dispatch(updateSkillStatusSuccess(skillUid, status)))
      .catch(error => dispatch(updateSkillStatusFailure(skillUid, error)));
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
const getSkillNoteLens = skillUid => R.lensPath(['entities', skillUid, 'notes']);

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: (state, action) => {
    const skills = R.path(['payload', 'skills'], action);
    const entities = R.merge(state.entities, skills);
    return R.merge(state, { entities });
  },
  [updateSkillStatusSuccess]: (state, action) => {
    const { skillUid, status } = action.payload;
    const currentSkillStatusLens = R.lensPath(['entities', skillUid, 'status', 'current']);

    return R.compose(
      R.set(errorsLens, R.omit([skillUid], state.errors)),
      R.set(currentSkillStatusLens, status),
    )(state);
  },
  [updateSkillStatusFailure]: (state, action) => {
    const { skillUid, error } = action.payload;
    const errorMsg = R.prop('message', error) || 'unknown';
    const errorLens = R.lensPath(['errors', skillUid]);

    return R.set(errorLens, errorMsg, state);
  },
  [noteActions.addNoteSuccess]: (state, action) => {
    const { skillUid } = action.payload;
    const skill = R.path(['entities', skillUid], state);

    if (!skill) return state;

    const noteId = R.path(['payload', 'note', 'id'], action) ;
    const notes = noteId
      ? R.concat([noteId], R.path(['entities', skillUid, 'notes'], state) || [])
      : R.path(['entities', skillUid, 'notes'], state);

    return R.set(getSkillNoteLens(skillUid), notes, state);
  },
  [noteActions.removeNoteSuccess]: (state, action) => {
    const { skillUid, noteId } = action.payload;
    const skill = R.path(['entities', skillUid], state);

    if (!skill || !noteId) return state;

    const notes = R.reject(id => id === noteId, R.path(['entities', skillUid, 'notes'], state));
    return R.set(getSkillNoteLens(skillUid), notes, state);
  },
}, initialState);

export const getSkill = (state, skillUid) =>
  R.path(['entities', skillUid], state);

export const getSkillError = (state, skillUid) =>
  R.path(['errors', skillUid], state);

export const getSkillStatus = (state, skillUid) =>
  R.path(['entities', skillUid, 'status'], state);

export const getErringSkills = (state, skillUids) => {
  const skillOfInterest = skillUid => R.contains(skillUid, skillUids);
  const name = skillUid => R.prop('name', getSkill(state, skillUid));

  return R.compose(
    R.map(name),
    R.filter(skillOfInterest),
    R.keys,
    R.prop('errors'),
  )(state);
};

// TODO: Stop using any here if possible
const notesForSkill:any = (skillUid, state) => R.path(['entities', skillUid, 'notes'], state);

export const getNotesForSkill = (state, skillUid) =>
  notesForSkill(skillUid, state) || [];

export const hasNotes = (state, skillUid) =>
  R.length(notesForSkill(skillUid, state)) > 0;
