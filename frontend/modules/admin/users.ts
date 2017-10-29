import { handleActions, createAction } from 'redux-actions';
import * as keymirror from 'keymirror';
import * as R from 'ramda';
import api from '../../api';

export const constants = keymirror({
  ADD_USER_SUCCESS: null,
  ADD_USER_FAILURE: null,
  USER_UPDATE_SUCCESS: null,
  USER_UPDATE_FAILURE: null,
  START_EVALUATION_SUCCESS: null,
  START_EVALUATION_FAILURE: null,
});

const addUserSuccess = createAction(constants.ADD_USER_SUCCESS);
const addUserFailure = createAction(constants.ADD_USER_FAILURE);
const userUpdateSuccess = createAction(constants.USER_UPDATE_SUCCESS);
const userUpdateFailure = createAction(constants.USER_UPDATE_FAILURE);
const startEvaluationSuccess = createAction(constants.START_EVALUATION_SUCCESS);
const startEvaluationFailure = createAction(constants.START_EVALUATION_FAILURE);

function startEvaluation(userId) {
  return dispatch => api.startEvaluation(userId)
    .then(evaluation => dispatch(startEvaluationSuccess(Object.assign({}, evaluation, { success: true }))))
    .catch(err => dispatch(startEvaluationFailure(Object.assign({}, err, { success: false }))));
}

function addUser(user) {
  return dispatch => api.saveUser(user)
    .then(user => dispatch(addUserSuccess(user)))
    .catch(err => dispatch(addUserFailure(err)));
}

function selectMentor(mentorId, user) {
  return dispatch => api.selectMentor(mentorId, user.id)
    .then(user => dispatch(userUpdateSuccess(user)))
    .catch(err => dispatch(userUpdateFailure(err)));
}

function selectLineManager(lineManagerId, user) {
  return dispatch => api.selectLineManager(lineManagerId, user.id)
    .then(user => dispatch(userUpdateSuccess(user)))
    .catch(err => dispatch(userUpdateFailure(err)));
}

function selectTemplate(templateId, user) {
  return dispatch => api.selectTemplate(templateId, user.id)
    .then(user => dispatch(userUpdateSuccess(user)))
    .catch(err => dispatch(userUpdateFailure(err)));
}

function updateUserDetails(userId, { name, email }) {
  return dispatch => api.updateUserDetails(userId, name, email)
    .then(user => dispatch(userUpdateSuccess(user)))
    .catch(err => dispatch(userUpdateFailure(err)));
}

export const actions = {
  selectMentor,
  selectTemplate,
  selectLineManager,
  addUser,
  startEvaluation,
  updateUserDetails,
};

const handleUserUpdateSuccess = (state, action) =>
  Object.assign({},
    state,
    {
      users: R.map(user => (user.id === action.payload.id ? R.merge(user, action.payload) : user), state.users),
      success: true,
      error: null,
    });

const handleActionFailure = (state, action) => Object.assign({}, state, { error: action.payload, success: false });

const handleEvaluationEvent = (state, action) => Object.assign({}, state, { newEvaluations: [].concat(state.newEvaluations, action.payload) });

export default handleActions({
  [addUserSuccess]: (state, action) => Object.assign({}, state, { users: [].concat(state.users, action.payload), success: true, error: null }),
  [addUserFailure]: handleActionFailure,
  [userUpdateSuccess]: handleUserUpdateSuccess,
  [userUpdateFailure]: handleActionFailure,
  [startEvaluationSuccess]: handleEvaluationEvent,
  [startEvaluationFailure]: handleEvaluationEvent,
}, { users: [] });

const getUsers = (state): UserDetailsViewModel[] => R.prop('users', state);

export const getUserManagementError = state =>
    R.prop('error', state);

export const getUser = (state, userId: string) =>
  R.find(R.propEq('id', userId))(getUsers(state));

export const getSortedUsers = state =>
  R.sortBy(R.prop('name'), getUsers(state));
