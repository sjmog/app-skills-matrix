import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import api from '../api';

export const constants = keymirror({
  SAVE_USER_SUCCESS: null,
  SAVE_USER_FAILURE: null,
});

function saveUser(user) {
  return function (dispatch) {
    return api.saveUser(user)
      .then((user) => dispatch(actions.saveUserSuccess(user)))
      .catch((err) => dispatch(actions.saveUserFailure(err)))
  }
}

export const actions = {
  saveUserSuccess: createAction(constants.SAVE_USER_SUCCESS),
  saveUserFailure: createAction(constants.SAVE_USER_FAILURE),
  saveUser: saveUser,
};

export const reducers = handleActions({
  [actions.saveUserSuccess]: (state, action) => Object.assign({}, state, { users: [].concat(state.users, action.payload), success: true, error: null }),
  [actions.saveUserFailure]: (state, action) => Object.assign({}, state, { error: action.payload, success: false }),
}, { users: [] });
