import createSelectedUserWithNamedType from './createSelectedUserWithNamedType';
import * as keymirror from 'keymirror';

export const actionTypes = keymirror({
  SELECT_MENTEE: null,
});

const menteeEvaluationsView = createSelectedUserWithNamedType(actionTypes.SELECT_MENTEE);

export const actionCreators = menteeEvaluationsView.actionCreators;
export const getSelectedUser = menteeEvaluationsView.selectors.getSelectedUser;
export default menteeEvaluationsView.reducer;

