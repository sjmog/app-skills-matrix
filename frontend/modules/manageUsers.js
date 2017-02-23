import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import R from 'ramda';
import api from '../api';

export const constants = keymirror({
  ADD_USER_SUCCESS: null,
  ADD_USER_FAILURE: null,
  SELECT_MENTOR_SUCCESS: null,
  SELECT_MENTOR_FAILURE: null,
  SELECT_TEMPLATE_SUCCESS: null,
  SELECT_TEMPLATE_FAILURE: null,
});

const addUserSuccess = createAction(constants.ADD_USER_SUCCESS);
const addUserFailure = createAction(constants.ADD_USER_FAILURE);
const selectMentorSuccess = createAction(constants.SELECT_MENTOR_SUCCESS);
const selectMentorFailure = createAction(constants.SELECT_MENTOR_FAILURE);
const selectTemplateSuccess = createAction(constants.SELECT_TEMPLATE_SUCCESS);
const selectTemplateFailure = createAction(constants.SELECT_TEMPLATE_FAILURE);

function addUser(user) {
  return function (dispatch) {
    return api.saveUser(user)
      .then((user) => dispatch(addUserSuccess(user)))
      .catch((err) => dispatch(addUserFailure(err)))
  }
}

function selectMentor(mentorId, user) {
  return function (dispatch) {
    return api.selectMentor(mentorId, user.id)
      .then((user) => dispatch(selectMentorSuccess(user)))
      .catch((err) => dispatch(selectMentorFailure(err)));
  }
}

function selectTemplate(templateId, user) {
  return function (dispatch) {
    return api.selectTemplate(templateId, user.id)
      .then((user) => dispatch(selectTemplateSuccess(user)))
      .catch((err) => dispatch(selectTemplateFailure(err)));
  }
}

export const actions = {
  selectMentor,
  selectTemplate,
  addUser,
};

const handleUserUpdateSuccess = (state, action) =>
  Object.assign({},
    state,
    {
      users: R.map((user) => user.id === action.payload.id ? action.payload : user, state.users),
      success: true,
      error: null
    });

const handleActionFailure = (state, action) => Object.assign({}, state, { error: action.payload, success: false });

export const reducers = handleActions({
  [addUserSuccess]: (state, action) => Object.assign({}, state, { users: [].concat(state.users, action.payload), success: true, error: null }),
  [addUserFailure]: handleActionFailure,
  [selectMentorSuccess]: handleUserUpdateSuccess,
  [selectMentorFailure]: handleActionFailure,
  [selectTemplateSuccess]: handleUserUpdateSuccess,
  [selectTemplateFailure]: handleActionFailure,
}, { users: [] });
