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
    (evaluationId, skillsToDisplay) => ({ evaluationId, skillsToDisplay }),
);

function updateFilter(evaluationId, skillsToDisplay) {
    return dispatch => dispatch(updateSkillFilter(evaluationId, skillsToDisplay));
}

export const actionCreators = {
    updateFilter,
};

export const getSkillsToDisplay = (state, evaluationId) => state.hasOwnProperty(evaluationId) ? state[evaluationId] : [];

export const getIsFiltered = (state, evaluationId) => state.isFiltered;

export default handleActions({
    [updateSkillFilter]: (state, { payload: { evaluationId, skillsToDisplay } }) =>
        ({ [evaluationId]: skillsToDisplay, isFiltered: !state.isFiltered }),
    [evaluationsActions.retrieveEvaluationSuccess]: (state, { payload: { id, skillUids } }) =>
        ({ [id]: skillUids, isFiltered: false }),
}, initialState);
