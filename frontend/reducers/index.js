import { handleActions } from 'redux-actions';

const init = [];

export default handleActions({
  ADD_USER:
    (state = init, action) => [].concat(state, action.payload)
}, init);
