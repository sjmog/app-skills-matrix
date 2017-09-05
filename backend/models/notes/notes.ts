import note from './note';
import * as R from 'ramda';
import { DatabaseObject } from '../../database';

export type Notes = {
  getUserIds: () => string[],
  normalizedViewModel: () => { [id: string]: NoteViewModel },
};

const normalize = arr =>
  arr.reduce((acc, n) =>
    Object.assign({}, acc, { [note(n).id]: note(n).viewModel() }), {});

// TODO: Fix types
export default notesArray => Object.freeze({
  getUserIds() {
    return R.map(R.prop('userId'), notesArray);
  },
  normalizedViewModel() {
    return normalize(notesArray);
  },
});
