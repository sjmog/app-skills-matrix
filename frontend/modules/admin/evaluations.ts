import { handleActions, createAction } from 'redux-actions';
import * as isPlainObject from 'is-plain-object';
import * as R from 'ramda';
import * as keymirror from 'keymirror';
import { startEvaluationSuccess } from './users';

import api from '../../api';
import { sortNewestToOldest } from '../utils';

type EvaluationState = {
  entities: { [id: string]: EvaluationMetadataViewModel },
  errors: { [actionType: string]: string },
};

export const actionTypes = keymirror({
  STATUS_UPDATE_SUCCESS: null,
  STATUS_UPDATE_FAILURE: null,
});

const evaluationStatusUpdateSuccess = createAction(
  actionTypes.STATUS_UPDATE_SUCCESS,
  (evaluationId, status) => ({ evaluationId, status }),
);

const evaluationStatusUpdateFailure = createAction(
  actionTypes.STATUS_UPDATE_FAILURE,
);

function updateEvaluationStatus(evaluationId, status) {
  return dispatch => api.updateEvaluationStatus(evaluationId, status)
    .then(() => dispatch(evaluationStatusUpdateSuccess(evaluationId, status)))
    .catch(err => dispatch(evaluationStatusUpdateFailure(err)));
}

export const actionCreators = {
  updateEvaluationStatus,
};

export const initialState = {
  entities: {},
  errors: {},
};

export default handleActions({
  [evaluationStatusUpdateSuccess]: (state: EvaluationState, action) => {
    const evaluationId = R.path(['payload', 'evaluationId'], action) as string;
    const status = R.path(['payload', 'status'], action) as string;
    const evaluationInState = R.path(['entities', evaluationId], state);

    if (!evaluationInState || !status) return state;

    const statusLens = R.lensPath(['entities', evaluationId, 'status']);
    const errsLens = R.lensPath(['errors']);
    const actionType = evaluationStatusUpdateFailure().type;

    return R.compose(
      R.set(errsLens, R.omit([actionType], state.errors)),
      R.set(statusLens, status),
    )(state);
  },
  [evaluationStatusUpdateFailure]: (state: EvaluationState, action) => {
    const type = evaluationStatusUpdateFailure().type;
    const errLens = R.lensPath(['errors', type]);
    const errMsg = R.path(['payload', 'message'], action) || 'Unknown';

    return isPlainObject(state.errors)
      ? R.set(errLens, errMsg, state)
      : R.set(errLens, errMsg, { ...state, errors: initialState.errors });
  },
  [startEvaluationSuccess]: (state: EvaluationState, action) => {
    const evaluationId = R.path(['payload', 'id'], action) as any;

    if (!evaluationId) return state;

    const entityLens = R.lensPath(['entities', evaluationId]);
    return R.set(entityLens, action.payload, state);
  },
}, initialState);

export const getEvaluationStatus = (state: EvaluationState, evaluationId: string): string =>
  R.path(['entities', evaluationId, 'status'], state);

export const getSortedEvaluationsByUserId = (state, userId: string): EvaluationMetadataViewModel[] => {
  const allEvaluations = R.values(R.prop('entities', state));
  const userEvaluations = R.filter(state => R.equals(R.path(['subject', 'id'], state), userId), allEvaluations);
  return sortNewestToOldest(userEvaluations);
};

export const getStatusUpdateError = (state: EvaluationState): string | null =>
  R.path(['errors', evaluationStatusUpdateFailure().type], state) || null;
