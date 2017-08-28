import user from './user';

const normalize = arr =>
  arr.reduce((acc, n) =>
    Object.assign({}, acc, { [user(n).id]: user(n).userDetailsViewModel() }), {});

export default (usersArray) => {
  return Object.freeze({
    normalizedViewModel() {
      return normalize(usersArray);
    },
  });
};
