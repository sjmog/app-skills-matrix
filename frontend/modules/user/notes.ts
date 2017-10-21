import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';
import * as keymirror from 'keymirror';
import { sortNewestToOldest } from '../utils';
import api from '../../api';
import { actions as evaluationsActions } from './evaluations';
import handleEvaluationRetrieved from './utils/entityRetrievedHandler';

export const actionTypes = keymirror({
  ADD_NOTE_SUCCESS: null,
  NOTE_ERROR: null,
  CLEAR_ERROR: null,
  DELETE_NOTE_SUCCESS: null,
});

type NotesState = {
  entities: NormalizedNotes,
  error: string,
};

const addNoteSuccess = createAction(
  actionTypes.ADD_NOTE_SUCCESS,
  (skillUid, note) => ({ skillUid, note }),
);

const deleteNoteSuccess = createAction(
  actionTypes.DELETE_NOTE_SUCCESS,
  (skillUid, noteId) => ({ skillUid, noteId }),
);

const noteError = createAction(
  actionTypes.NOTE_ERROR,
);

const clearError = createAction(
  actionTypes.CLEAR_ERROR,
);

export const actions = {
  addNoteSuccess,
  deleteNoteSuccess,
  noteError,
};

function addNote(evaluationId: string, skillId: number, skillUid: string, note: string) {
  return dispatch =>
    api.addNote(evaluationId, skillId, note)
      .then(persistedNote => dispatch(addNoteSuccess(skillUid, persistedNote)))
      .catch((error) => {
        const message = error.message ? `Unable to add note: ${error.message}` : 'Unable to add note';
        dispatch(noteError(message));

        setTimeout(() => {
          dispatch(clearError());
        }, 5000);
      });
}

function deleteNote(evaluationId:string, skillId: number, skillUid: string, noteId: string) {
  return dispatch =>
    api.deleteNote(evaluationId, skillId, noteId)
      .then(() => dispatch(deleteNoteSuccess(skillUid, noteId)))
      .catch((error) => {
        const message = error.message ? `Unable to remove note: ${error.message}` : 'Unable to remove note';
        dispatch(noteError(message));

        setTimeout(() => {
          dispatch(clearError());
        }, 5000);
      });
}

export const actionCreators = {
  addNote,
  deleteNote,
};

export const initialState = {
  entities: {},
  error: {},
};

const getNoteLens = id => R.lensPath(['entities', id]);

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: handleEvaluationRetrieved('notes'),
  [addNoteSuccess]: (state: NotesState, action) => {
    const noteId = R.path(['payload', 'note', 'id'], action);
    return R.set(getNoteLens(noteId), R.path(['payload', 'note'], action), state);
  },
  [noteError]: (state: NotesState, action) => {
    return R.merge(state, { error: action.payload });
  },
  [clearError]: (state: NotesState) => {
    return R.merge(state, { error: null });
  },
  [deleteNoteSuccess]: (state: NotesState, action) => {
    const noteId = R.path(['action', 'payload', 'noteId'], action);
    const entities = R.omit([action.payload], state.entities);
    return R.merge(state, { entities });
  },
}, initialState);

export const getNote = (state, noteId: string): NoteViewModel =>
  R.path(['entities', noteId], state) || null;


export const getSortedNotes = (state: NotesState, noteIds: string[]): NoteViewModel[] => {
  if (R.is(Array, noteIds) && noteIds.length > 0) {
    const notes = R.map(id => getNote(state, id), noteIds);
    return notes ? sortNewestToOldest(notes) : [];
  }

  return [];
};

export const getNotesError = (state: NotesState): string => {
  const error:string = R.prop('error', state);
  return R.isEmpty(error) ? '' : error;
};
