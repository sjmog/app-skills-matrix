import note from './note';

const normalize = arr =>
  arr.reduce((acc, n) =>
    Object.assign({}, acc, { [note(n).id]: note(n).viewModel() }), {});

export default (notesArray) => {
  return Object.freeze({
    normalizedViewModel() {
      return normalize(notesArray);
    },
  });
};
