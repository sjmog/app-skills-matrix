import { expect } from 'chai';
import { getNotes} from '../../../../../../frontend/modules/user/notes';

describe('Notes selectors', () => {
  describe('getNotes', () => {
    it('returns a list of notes for given ids', () => {
      const state = {
        entities: {
          note_1: { id: 'A' },
          note_2: { id: 'B' },
        }
      };
      const noteIds = ['note_1', 'note_2'];

      expect(getNotes(state, noteIds)).to.eql([{ id: 'A' }, { id: 'B' }]);
    });

    it('ignores notes with ids that have not been requested', () => {
      const state = {
        entities: {
          note_1: { id: 'A' },
          note_2: { id: 'B' },
        }
      };
      const noteIds = ['note_1'];

      expect(getNotes(state, noteIds)).to.eql([{ id: 'A' }]);
    });

    it('returns an empty list when no note ids are provided', () => {
      const state = {
        entities: {
          note_1: { id: 'A' },
        }
      };
      const noteIds = [];

      expect(getNotes(state, noteIds)).to.eql([]);
    });

    it('returns an empty list when there are no matching notes', () => {
      const state = {
        entities: {
          note_1: { id: 'A' },
        }
      };
      const noteIds = ['note_2'];

      expect(getNotes(state, noteIds)).to.eql([]);
    });

    it('returns an empty list when there are no entities in state', () => {
      const state = {
        not: 'entities'
      };
      const noteIds = ['note_1'];

      expect(getNotes(state, noteIds)).to.eql([]);
    });

    it('ignores malformed note ids', () => {
      const state = {
        entities: {
          note_1: { id: 'A' }
        }
      };

      const noteIds = [0, false, {}, [], undefined, null, 'note_1'];
      expect(getNotes(state, noteIds)).to.eql([{ id: 'A' }]);
    });
  });
});