import * as R from 'ramda';
import * as isPlainObject from 'is-plain-object';

export default entity =>
  (state, action) => {
    const notes = R.path(['payload', entity], action);

    if (!isPlainObject(notes)) return state;

    const entities = R.merge(state.entities, notes);
    return R.merge(state, { entities });
  };
