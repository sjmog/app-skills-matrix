import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';

export const constants = keymirror({
  SAVE_USER_SUCCESS: null,
});

function saveUser(user) {
  return function (dispatch) {
    return Promise.resolve(user)
      .then((user) => dispatch(actions.saveUserSuccess(user)))
      .catch((err) => {})
  }
}

export const actions = {
  saveUserSuccess: createAction(constants.SAVE_USER_SUCCESS),
  saveUser: saveUser,
};

export const reducers = handleActions({
  [actions.saveUserSuccess]: (state, action) => [].concat(state, action.payload),
}, { users: [] });
