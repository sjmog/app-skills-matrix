import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';
import * as keymirror from 'keymirror';
import * as moment from 'moment';

import { actions as evaluationsActions } from './evaluations';

const isArray = val => R.type(val) === 'Array';
const isObject = val => R.type(val) === 'Object';

const stubNoteAddition = (skillUid, note) => Promise.resolve({
  id: `note_id_${Math.random()}`,
  author: {
    name: 'Jo Bloggs',
    username: 'jobloggs',
    avatarUrl: 'https://avatars1.githubusercontent.com/u/1444502?v=4',
  },
  date: moment(),
  note,
});

export const actionTypes = keymirror({
  ADD_NOTE_SUCCESS: null,
  ADD_NOTE_FAILURE: null,
});

const addNoteSuccess = createAction(
  actionTypes.ADD_NOTE_SUCCESS,
  (skillUid, note) => ({ skillUid, note }),
);

const addNoteFailure = createAction(
  actionTypes.ADD_NOTE_FAILURE,
);

export const actions = {
  addNoteSuccess,
  addNoteFailure,
};

function addNote(skillUid, note) {
  return dispatch =>
    stubNoteAddition(skillUid, note)
      .then(persistedNote => dispatch(addNoteSuccess(skillUid, persistedNote)))
      .catch(error => dispatch(addNoteFailure(error)));
}

export const actionCreators = {
  addNote,
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
}, initialState);

export const getNote = (state, noteId) =>
  R.path(['entities', noteId], state);

// TODO: Write test for this.
export const getNotesError = (state) => {
  const error = R.prop('error', state);
  return R.isEmpty(error) ? false : error;
};
