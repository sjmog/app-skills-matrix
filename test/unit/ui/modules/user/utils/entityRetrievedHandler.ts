import { expect } from 'chai';

import { constants as evalActionTypes } from '../../../../../../frontend/modules/user/evaluations';
import handleEvaluationRetrieved from '../../../../../../frontend/modules/user//utils/entityRetrievedHandler';
const handler = handleEvaluationRetrieved('entities_name');

import { handleActions } from 'redux-actions';

describe('RETRIEVE_EVALUATION_SUCCESS', () => {
  it('adds entities', () => {
    const state = {
      entities: {},
      error: {},
    };
    const action = {
      type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
      payload: {
        entities_name: {
          entity_1: {},
        },
      },
    };

    expect(handler(state, action).entities).to.eql({ entity_1: {} });
  });

  it('adds to existing entities', () => {
    const state = {
      entities: {
        entity_1: {},
      },
    };
    const action = {
      type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
      payload: {
        entities_name: {
          entity_2: {},
        },
      },
    };

    expect(handler(state, action).entities).to.eql({ entity_1: {}, entity_2: {} });
  });

  it('overrides an entity that already exists', () => {
    const state = {
      entities: {
        entity_1: { a: 'A' },
      },
    };
    const action = {
      type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
      payload: {
        entities_name: {
          entity_1: { b: 'B' },
        },
      },
    };

    expect(handler(state, action).entities).to.eql({ entity_1: { b: 'B' } });
  });

  it('leaves existing entities alone when value for entites in payload is an empty object', () => {
    const state = {
      entities: {
        entity_1: { a: 'A' },
      },
    };
    const action = {
      type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
      payload: {
        entities_name: {},
      },
    };

    expect(handler(state, action).entities).to.eql({ entity_1: { a: 'A' } });
  });

  it('leaves existing entities alone when value for entities in payload is not an object', () => {
    const state = {
      entities: {
        entity_1: { a: 'A' },
      },
    };
    const action = v => ({
      type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
      payload: {
        entities_name: v,
      },
    });

    [0, null, [], [1], '', undefined, false, 0, 'abc', NaN, new Date()].forEach(v =>
      expect(handler(state, action(v)).entities).to.eql({ entity_1: { a: 'A' } }));
  });

  it('leaves existing entities alone when no field for the entity exists in payload', () => {
    const state = {
      entities: {
        entity_1: { a: 'A' },
      },
    };
    const action = {
      type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
      payload: {},
    };

    expect(handler(state, action).entities).to.eql({ entity_1: { a: 'A' } });
  });
});
