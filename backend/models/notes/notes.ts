import note, { Note } from './note';
import * as R from 'ramda';

export type Notes = {
  getUserIds: () => string[],
  normalizedViewModel: () => any, // TODO: Object where the value of each key is a note view model
};

const normalize = arr =>
  arr.reduce((acc, n) =>
    Object.assign({}, acc, { [note(n).id]: note(n).viewModel() }), {});

export default (notesArray: Note[]): Notes => Object.freeze({
  getUserIds() {
    return R.map(R.prop('userId'), notesArray);
  },
  normalizedViewModel() {
    return normalize(notesArray);
  },
});
