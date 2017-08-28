import note from './note';
import * as R from 'ramda';

const normalize = arr =>
  arr.reduce((acc, n) =>
    Object.assign({}, acc, { [note(n).id]: note(n).viewModel() }), {});

export default (notesArray) => {
  return Object.freeze({
    getUserIds() {
      return R.map(R.prop('userId'), notesArray);
    },
    normalizedViewModel() {
      return normalize(notesArray);
    },
  });
};
