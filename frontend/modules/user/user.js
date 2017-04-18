import { handleActions } from 'redux-actions';

export default handleActions({
  foo: (state) => state, // :-/ needed cause reasons (redux??)
}, { userDetails: {} });
