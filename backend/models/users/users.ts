import user, { UnhyrdatedUser } from './user';
import { DatabaseObject } from '../../database';

export type Users = {
  normalizedViewModel: () => { [id: string]: UserDetailsViewModel },
};

const normalize = (arr: [UnhyrdatedUser & DatabaseObject]) =>
  arr.reduce((acc, u) =>
    Object.assign({}, acc, { [user(u).id]: user(u).userDetailsViewModel() }), {});

export default (usersArray: [UnhyrdatedUser & DatabaseObject]) => Object.freeze({
  normalizedViewModel() {
    return normalize(usersArray);
  },
});
