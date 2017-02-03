import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';

export const constants = keymirror({
  SUBMIT_IMPORT_SUCCESS: null,
});

function submitImport(jsonImport) {
  return function (dispatch) {
    return Promise.resolve(jsonImport)
      .then(() => dispatch(actions.SUBMIT_IMPORT_SUCCESS({ success: true })))
      .catch((err) => {})
  }
}

export const actions = {
  SUBMIT_IMPORT_SUCCESS: createAction(constants.SUBMIT_IMPORT_SUCCESS),
  submitImport: submitImport,
};

export const reducers = handleActions({
  [actions.SUBMIT_IMPORT_SUCCESS]: (state, action) => {
    return Object.assign({}, state, action.payload);
  },
}, {});
