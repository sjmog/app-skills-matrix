import {expect} from 'chai';
import * as moment from 'moment';

import reducer, {initialState, actionTypes} from '../../../../../../frontend/modules/user/notes';
import {constants as evalActionTypes} from '../../../../../../frontend/modules/user/evaluations';

describe('Evaluation reducer', () => {
  describe('RETRIEVE_EVALUATION_SUCCESS', () => {
    it('adds notes', () => {
      const state = initialState;
      const action = {
        type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
        payload: {
          notes: {
            note_1: {},
          },
        },
      };

      expect(reducer(state, action).entities).to.eql({ note_1: {} });
    });

    it('adds to existing notes', () => {
      const state = {
        entities: {
          note_1: {},
        },
      };
      const action = {
        type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
        payload: {
          notes: {
            note_2: {},
          },
        },
      };

      expect(reducer(state, action).entities).to.eql({ note_1: {}, note_2: {} });
    });

    it('overrides notes that already exist', () => {
      const state = {
        entities: {
          note_1: { a: 'A' },
        },
      };
      const action = {
        type: evalActionTypes.RETRIEVE_EVALUATION_SUCCESS,
        payload: {
          notes: {
            note_1: { b: 'B' },
          },
        },
      };

      expect(reducer(state, action).entities).to.eql({ note_1: { b: 'B' } });
    });
  });

  describe('ADD_NOTE_SUCCESS', () => {
    it('adds a new note', () => {
      const state = {
        entities: {}
      };
      const action = {
        type: actionTypes.ADD_NOTE_SUCCESS,
        payload: { note: { id: 'note_1' } }
      };

      expect(reducer(state, action).entities).to.eql({ note_1: { id: 'note_1' } })
    });

    it('does not remove any existing notes when a new one is added', () => {
      const state = {
        entities: { note_1: { id: 'note_1' } },
      };
      const action = {
        type: actionTypes.ADD_NOTE_SUCCESS,
        payload: { note: { id: 'note_2' } }
      };

      expect(reducer(state, action).entities).to.eql(
        {
          note_1: { id: 'note_1' },
          note_2: { id: 'note_2' }
        })
    });
  });
});
