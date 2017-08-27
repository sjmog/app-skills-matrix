import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';
import * as keymirror from 'keymirror';
import * as moment from 'moment';

import api from '../../api';

import { actions as evaluationsActions } from './evaluations';

const stubNoteRemoval = noteId => Promise.resolve();

export const actionTypes = keymirror({
  ADD_NOTE_SUCCESS: null,
  ADD_NOTE_FAILURE: null,
  CLEAR_ERROR: null,
  REMOVE_NOTE_SUCCESS: null,
});

const addNoteSuccess = createAction(
  actionTypes.ADD_NOTE_SUCCESS,
  (skillUid, note) => ({ skillUid, note }),
);

const removeNoteSuccess = createAction(
  actionTypes.REMOVE_NOTE_SUCCESS,
  (skillUid, noteId) => ({ skillUid, noteId }),
);

const addNoteFailure = createAction(
  actionTypes.ADD_NOTE_FAILURE,
);

const clearError = createAction(
  actionTypes.CLEAR_ERROR,
);

export const actions = {
  addNoteSuccess,
  addNoteFailure,
  removeNoteSuccess,
};

function addNote(evaluationId, skillId, skillUid, note) {
  return dispatch =>
    api.addNote(evaluationId, skillId, note)
      .then(persistedNote => dispatch(addNoteSuccess(skillUid, persistedNote))) // TODO: Could we display a validation style error instead?
      .catch((error) => {
        dispatch(addNoteFailure(error));
        setTimeout(() => {
          dispatch(clearError());
        }, 5000);
      });
}

// TODO: We need to remove the note from the skill.
function removeNote(skillUid, noteId) {
  return dispatch =>
    stubNoteRemoval(noteId)
      .then(() => dispatch(removeNoteSuccess(skillUid, noteId)))
      .catch((error) => {
        dispatch(addNoteFailure(error)); // TODO: Make the error message relate to removal of notes.
        setTimeout(() => {
          dispatch(clearError());
        }, 5000);
      });
}

export const actionCreators = {
  addNote,
  removeNote,
};

export const initialState = {
  entities: {},
  error: {},
};

const getNoteLens = id => R.lensPath(['entities', id]);

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: (state, action) => {
    const notes = R.path(['payload', 'notes'], action);
    const entities = R.merge(state.entities, notes);
    return R.merge(state, { entities });
  },
  [addNoteSuccess]: (state, action) => {
    const noteId = R.path(['payload', 'note', 'id'], action);
    return R.set(getNoteLens(noteId), R.path(['payload', 'note'], action), state);
  },
  [addNoteFailure]: (state, action) => {
    return R.merge(state, { error: action.payload });
  },
  [clearError]: (state) => {
    return R.merge(state, { error: null });
  },
  [removeNoteSuccess]: (state, action) => {
    const noteId = R.path(['action', 'payload', 'noteId'], action);
    const entities = R.omit([action.payload], state.entities);
    return R.merge(state, { entities });
  },
}, initialState);

export const getNote = (state, noteId) =>
  R.path(['entities', noteId], state);

// TODO: Write test for this.
export const getNotesError = (state) => {
  const error = R.prop('error', state);
  return R.isEmpty(error) ? false : error;
};
