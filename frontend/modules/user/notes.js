import { handleActions } from 'redux-actions';
import * as R from 'ramda';

import { actions as evaluationsActions } from './evaluations';

const isArray = val => R.type(val) === 'Array';
const isObject = val => R.type(val) === 'Object';

export const initialState = {
  entities: {},
  errors: {},
};

export default handleActions({
  [evaluationsActions.retrieveEvaluationSuccess]: (state, action) => {
    const notes = R.path(['payload', 'notes'], action);
    const entities = R.merge(state.entities, notes);
    return R.merge(state, { entities });
  },
}, initialState);

export const getNotes = (state, noteIds) => {
  const notes = R.prop('entities', state);

  if (!isArray(noteIds) || !isObject(notes)) {
    return [];
  }

  return R.compose(
    R.filter(note => !R.isNil(note)),
    R.values,
    R.pickAll(noteIds),
    R.prop('entities'),
  )(state);
};