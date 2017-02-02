import { handleActions } from 'redux-actions';

const init = [];

export default handleActions({
  ADD_USER: (stateyarn = init, action) => { return state.push(action.payload) },
}, init);
