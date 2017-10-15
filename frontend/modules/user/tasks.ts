import { handleActions, createAction } from 'redux-actions';
import * as keymirror from 'keymirror';
import * as R from 'ramda';

import api from '../../api';

export const actionTypes = keymirror({
  RETRIEVE_TASKS_SUCCESS: null,
  RETRIEVE_TASKS_FAILURE: null,
  LOADING_TASKS: null,
  RESET_TASKS: null,
});

const actions = {
  retrieveTasksSuccess: createAction(actionTypes.RETRIEVE_TASKS_SUCCESS, tasks => tasks),
  retrieveTasksFailure: createAction(actionTypes.RETRIEVE_TASKS_FAILURE, error => error),
  loadingTasks: createAction(actionTypes.LOADING_TASKS),
  resetTasks: createAction(actionTypes.RESET_TASKS),
};

function retrieveTasks(userId) {
  return (dispatch) => {
    dispatch(actions.loadingTasks);

    return api.retrieveTasks(userId)
      .then(tasks => dispatch(actions.retrieveTasksSuccess(tasks)))
      .catch(error => dispatch(actions.retrieveTasksFailure(error)));
  };
}

function resetTasks() {
  return actions.resetTasks();
}

export const actionCreators = {
  retrieveTasks,
  resetTasks,
};

// TODO: type definition of state.
export const initialState = {
  tasks: [],
  error: null,
  loading: true,
};

// TODO: may want to add basic reducer tests.
export default handleActions({
  [actions.retrieveTasksSuccess]: (state, action) => ({ ...action.payload, error: null, loading: false }),
  [actions.retrieveTasksFailure]: (state, action) => ({ ...initialState, error: action.payload }),
  [actions.loadingTasks]: () => initialState,
  [actions.resetTasks]: () => initialState,
}, initialState);

export const getTasks = state =>
  R.prop('tasks', state);

export const getTasksLoadingState = state =>
  R.prop('loading', state);

export const getTasksError = state =>
  R.prop('error', state);

