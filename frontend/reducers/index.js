import { handleActions } from 'redux-actions';

const init = [];

export default handleActions({
  ADD_USER: (state = init, action) => { return state.push(action.payload) },
}, init);
