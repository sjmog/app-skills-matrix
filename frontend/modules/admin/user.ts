import * as R from 'ramda';

export default (state = null) => state; /* portion of state never requires updating */

export const getLoggedInUsername = (state?: UserDetailsViewModel): string =>
  R.path(['username'], state);
