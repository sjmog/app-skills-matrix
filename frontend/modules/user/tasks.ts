import { handleActions, createAction } from 'redux-actions';
import * as keymirror from 'keymirror';
import * as R from 'ramda';

import api from '../../api';

type TasksState = {
  tasks: TaskList,
  loading: boolean,
  error: null | { message: string },
};

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

export const initialState = {
  tasks: [],
  error: null,
  loading: true,
};

export default handleActions({
  [actions.retrieveTasksSuccess]: (state: TasksState, action) => ({ tasks: action.payload, error: null, loading: false }),
  [actions.retrieveTasksFailure]: (state: TasksState, action) => ({ tasks: [], error: action.payload, loading: false }),
  [actions.loadingTasks]: () => initialState,
  [actions.resetTasks]: () => initialState,
}, initialState);

export const getTasks = (state: TasksState): TaskList[] =>
  R.prop('tasks', state) || [];

export const getTasksLoadingState = (state: TasksState): boolean =>
  R.prop('loading', state);

export const getTasksError = (state: TasksState): null | { message?: string } =>
  R.prop('error', state);
