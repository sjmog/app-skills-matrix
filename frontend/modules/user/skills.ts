import { createAction, handleActions } from 'redux-actions';
import * as R from 'ramda';
import * as keymirror from 'keymirror';

import { actions as evaluationsActions } from './evaluations';
import { actions as noteActions } from './notes';
import handleEvaluationRetrieved from './utils/entityRetrievedHandler';

import api from '../../api';

export const SKILL_STATUS = keymirror({
  NEW: null,
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null,
});

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

    if (evaluationView === EVALUATION_VIEW.ADMIN) {
      updateSkillFn = api.adminUpdateSkillStatus;
    } else {
      updateSkillFn = api.updateSkillStatus;
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
const getSkillNoteLens = (skillUid: string) => R.lensPath(['entities', skillUid, 'notes']);

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: handleEvaluationRetrieved('skills'),
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
    const skill: UnhydratedEvaluationSkill = R.path(['entities', skillUid], state);

    if (!skill) return state;

    const noteId = R.path(['payload', 'note', 'id'], action) ;
    const notes = noteId
      ? R.concat([noteId], skill.notes || [])
      : R.path(['entities', skillUid, 'notes'], state);

    return R.set(getSkillNoteLens(skillUid), notes, state);
  },
  [noteActions.deleteNoteSuccess]: (state, action) => {
    const { skillUid, noteId } = action.payload;
    const skill: UnhydratedEvaluationSkill = R.path(['entities', skillUid], state);

    if (!skill || !noteId) return state;

    const notes = R.reject(id => id === noteId, skill.notes);
    return R.set(getSkillNoteLens(skillUid), notes, state);
  },
}, initialState);

export const getSkill = (state, skillUid: string): UnhydratedEvaluationSkill =>
  R.path(['entities', skillUid], state);

export const getSkillError = (state, skillUid) =>
  R.path(['errors', skillUid], state);

export const getSkillStatus = (state, skillUid) =>
  R.path(['entities', skillUid, 'status'], state);

export const getErringSkills = (state, skillUids: string[]) => {
  const skillOfInterest = skillUid => R.contains(skillUid, skillUids);
  const name = skillUid => R.prop('name', getSkill(state, skillUid));

  return R.compose(
    R.map(name),
    R.filter(skillOfInterest),
    R.keys,
    R.prop('errors'),
  )(state);
};

const notesForSkill = (skillUid: string, state): string[] => R.path(['entities', skillUid, 'notes'], state);

export const getNotesForSkill = (state, skillUid: string): string[] =>
  notesForSkill(skillUid, state) || [];

export const hasNotes = (state, skillUid: string): boolean =>
  R.length(notesForSkill(skillUid, state)) > 0;

const hasStatus = (status: string) =>
  (skill): boolean => R.path(['status', 'current'], skill) === status;

export const getSkillsWithCurrentStatus = (state, status: string, skillUids: string[]): string[] => {
  if (!R.is(Array, skillUids) || skillUids.length === 0) {
    return [];
  }

  const skills = R.pickBy((val, key) => skillUids.indexOf(key) >= 0, R.path(['entities'], state));
  return R.keys(skills).length > 0 ? R.keys(R.pickBy(hasStatus(status), skills)) : [];
};

const getSkillName = (state, uid) => {
  const skill = getSkill(state, uid);

  if (!skill) return `Unable to find skill details: ${uid}`;
  return skill.name || `Malformed skill: ${uid}`;
};

export const getSkillNames = (state, skillUids: string[]) => {
  if (!Array.isArray(skillUids)) return null;
  return R.map(uid => getSkillName(state, uid), skillUids);
};
