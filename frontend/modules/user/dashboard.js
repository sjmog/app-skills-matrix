import { handleActions } from 'redux-actions';

export const reducers = handleActions({
  foo: (state) => state, // :-/ needed cause reasons (redux??)
}, { user: {} });
