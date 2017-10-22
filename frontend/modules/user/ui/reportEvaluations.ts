import createSelectedUserWithNamedType from './createSelectedUserWithNamedType';
import * as keymirror from 'keymirror';

export const actionTypes = keymirror({
  SELECT_REPORT: null,
});

const reportEvaluationsView = createSelectedUserWithNamedType(actionTypes.SELECT_REPORT);

export const actionCreators = reportEvaluationsView.actionCreators;
export const getSelectedUser = reportEvaluationsView.selectors.getSelectedUser;
export default reportEvaluationsView.reducer;
