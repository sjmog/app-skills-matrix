import user from './user';

export type Users = {
  normalizedViewModel: () => any, // TODO: Object where the value of each key is a user view model
};

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
