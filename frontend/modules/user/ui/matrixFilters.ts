import { createAction, handleActions } from 'redux-actions';
import * as keymirror from 'keymirror';
import { actions as evaluationsActions } from '../evaluations';

type MatrixFiltersState = {
    currentFilter: string,
    evaluationId: string[],
};

const initialState = {
    currentFilter: null,
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

export const getSkillsToDisplay = (state: MatrixFiltersState, evaluationId) => state.hasOwnProperty(evaluationId) ? state[evaluationId] : [];

export const getCurrentFilter = (state: MatrixFiltersState, evaluationId) => state.currentFilter;

export default handleActions({
    [updateSkillFilter]: (state: MatrixFiltersState, { payload: { evaluationId, filter, skillsToDisplay } }) =>
        ({ [evaluationId]: skillsToDisplay, currentFilter: state.currentFilter !== filter ? filter : null }),
    [evaluationsActions.retrieveEvaluationSuccess]: (state: MatrixFiltersState, { payload: { id, skillUids } }) =>
        ({ [id]: skillUids, currentFilter: null }),
}, initialState);
