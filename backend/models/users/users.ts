import user, { UnhyrdatedUser } from './user';
import { DatabaseObject } from '../../database';

export type Users = {
  normalizedViewModel: () => { [id: string]: UserDetailsViewModel },
};

const normalize = arr =>
  arr.reduce((acc, u) =>
    Object.assign({}, acc, { [user(u).id]: user(u).userDetailsViewModel() }), {});

// TODO: Fix types
export default usersArray => Object.freeze({
  normalizedViewModel() {
    return normalize(usersArray);
  },
});
