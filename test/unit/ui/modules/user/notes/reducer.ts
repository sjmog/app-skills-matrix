import { expect } from 'chai';

import reducer, { actionTypes } from '../../../../../../frontend/modules/user/notes';

describe('Notes reducer', () => {
  describe('ADD_NOTE_SUCCESS', () => {
    it('adds a new note', () => {
      const state = {
        entities: {},
      };
      const action = {
        type: actionTypes.ADD_NOTE_SUCCESS,
        payload: { note: { id: 'note_1' } },
      };

      expect(reducer(state, action).entities).to.eql({ note_1: { id: 'note_1' } });
    });

    it('does not remove any existing notes when a new one is added', () => {
      const state = {
        entities: { note_1: { id: 'note_1' } },
      };
      const action = {
        type: actionTypes.ADD_NOTE_SUCCESS,
        payload: { note: { id: 'note_2' } },
      };

      expect(reducer(state, action).entities).to.eql(
        {
          note_1: { id: 'note_1' },
          note_2: { id: 'note_2' },
        });
    });
  });

  describe('NOTE_ERROR', () => {
    it('adds an error', () => {
      const state = {
        error: {},
      };
      const action = {
        type: actionTypes.NOTE_ERROR,
        payload: 'reasons',
      };

      expect(reducer(state, action).error).to.eql('reasons');
    });

    it('overrides an existing error', () => {
      const state = {
        error: { message: 'reasons' },
      };
      const action = {
        type: actionTypes.NOTE_ERROR,
        payload: 'some other reasons',
      };

      expect(reducer(state, action).error).to.eql('some other reasons');
    });
  });
});

