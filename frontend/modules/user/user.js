import { handleActions } from 'redux-actions';
import R from 'ramda';

export default handleActions({
  foo: (state) => state, // :-/ needed cause reasons (redux??)
}, { userDetails: {} });

export const getUsername = (state) =>
  R.path(['userDetails', 'username'], state);
