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

export const actions = {
  addNoteSuccess,
};

function addNote(skillUid, note) {
  return dispatch =>
    stubNoteAddition(skillUid, note)
      .then(persistedNote => dispatch(addNoteSuccess(skillUid, persistedNote)))
      .catch(err => dispatch());
}

export const actionCreators = {
  addNote,
};

export const initialState = {
  entities: {},
  errors: {},
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
}, initialState);

export const getNotes = (state, noteIds) => {
  const notes = R.prop('entities', state);

  if (!isArray(noteIds) || !isObject(notes)) {
    return [];
  }

  return R.compose(
    R.filter(note => !R.isNil(note)),
    R.values,
    R.pickAll(noteIds),
    R.prop('entities'),
  )(state);
};
