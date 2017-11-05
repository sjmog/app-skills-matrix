import { createAction, handleActions } from 'redux-actions';
import * as keymirror from 'keymirror';
import { actions as evaluationsActions } from '../evaluations';

const initialState = {
    isFiltered: false,
};

export const actionTypes = keymirror({
    UPDATE_SKILL_FILTER: null,
});

const updateSkillFilter = createAction(
    actionTypes.UPDATE_SKILL_FILTER,
    (evaluationId, filter, skillsToDisplay) => ({ evaluationId, filter, skillsToDisplay }),
);

function updateFilter(evaluationId, filter, skillsToDisplay) {
    return dispatch => dispatch(updateSkillFilter(evaluationId, filter, skillsToDisplay));
}

export const actionCreators = {
    updateFilter,
};

export const getSkillsToDisplay = (state, evaluationId) => state.hasOwnProperty(evaluationId) ? state[evaluationId] : [];

export const getIsFiltered = (state, evaluationId, skillStatus) => state.isFiltered && state.isFiltered === skillStatus;

export default handleActions({
    [updateSkillFilter]: (state, { payload: { evaluationId, filter, skillsToDisplay } }) =>
        ({ [evaluationId]: skillsToDisplay, isFiltered: state.isFiltered !== filter ? filter : false }),
    [evaluationsActions.retrieveEvaluationSuccess]: (state, { payload: { id, skillUids } }) =>
        ({ [id]: skillUids, isFiltered: false }),
}, initialState);
