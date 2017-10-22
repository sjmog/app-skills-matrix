import { handleActions, createAction } from 'redux-actions';
import * as R from 'ramda';

export default (actionType) => {
  const actions = {
    selectUser: createAction(actionType, userId => userId),
  };

  function selectUser(userId: string) {
    return actions.selectUser(userId);
  }

  const actionCreators = {
    selectUser,
  };

  const initialState = {
    selectedUser: null,
  };

  const reducer = handleActions({
    [actions.selectUser]: (state, action) => ({ selectedUser: action.payload }),
  }, initialState);

  const getSelectedUser = state =>
    R.prop('selectedUser', state);

  return {
    actionCreators,
    reducer,
    selectors: { getSelectedUser },
  };
};
