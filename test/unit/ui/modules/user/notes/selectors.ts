import { expect } from 'chai';
import { getSortedNotes } from '../../../../../../frontend/modules/user/notes';

const getSortedNotesLenient = getSortedNotes as any;

describe('Notes selectors', () => {
  describe('getSortedNotes', () => {
    it('returns a list of notes sorted from newest to oldest', () => {
      const state = {
        entities: {
          NOTE_ID_1: { createdDate: '1900-01-01T00:01:01.001Z' },
          NOTE_ID_2: { createdDate: '2000-01-01T00:01:01.001Z' },
          NOTE_ID_3: { createdDate: '1950-01-01T00:01:01.001Z' },
        },
      };

      expect(getSortedNotesLenient(state, ['NOTE_ID_1', 'NOTE_ID_2', 'NOTE_ID_3'])).to.eql([
        { createdDate: '2000-01-01T00:01:01.001Z' },
        { createdDate: '1950-01-01T00:01:01.001Z' },
        { createdDate: '1900-01-01T00:01:01.001Z' },
      ]);
    });

    it('ignores notes that are not specified in the query', () => {
      const state = {
        entities: {
          NOTE_ID_1: { createdDate: '1900-01-01T00:01:01.001Z' },
          NOTE_ID_2: { createdDate: '2000-01-01T00:01:01.001Z' },
          NOTE_ID_3: { createdDate: '1950-01-01T00:01:01.001Z' },
        },
      };

      expect(getSortedNotesLenient(state, ['NOTE_ID_1', 'NOTE_ID_2'])).to.eql([
        { createdDate: '2000-01-01T00:01:01.001Z' },
        { createdDate: '1900-01-01T00:01:01.001Z' },
      ]);
    });

    it('handles invalid dates', () => {
      const state = {
        entities: {
          NOTE_ID_1: { createdDate: '1900-01-01T00:01:01.001Z' },
          NOTE_ID_2: { createdDate: true },
          NOTE_ID_3: { createdDate: null },
        },
      };

      expect(getSortedNotesLenient(state, ['NOTE_ID_1', 'NOTE_ID_2', 'NOTE_ID_3'])).to.eql([
        { createdDate: '1900-01-01T00:01:01.001Z' },
        { createdDate: true },
        { createdDate: null },
      ]);
    });

    it('returns null when note is requested but does not exist in state', () => {
      const state = {
        entities: {
          NOTE_ID_1: { createdDate: '1900-01-01T00:01:01.001Z' },
        },
      };

      expect(getSortedNotesLenient(state, ['NOTE_ID_1', 'NOTE_ID_2'])).to.eql([
        { createdDate: '1900-01-01T00:01:01.001Z' },
        null,
      ]);
    });

    it('returns an empty list when no notes are requested', () => {
      const state = {
        entities: {
          NOTE_ID_1: { createdDate: '1900-01-01T00:01:01.001Z' },
        },
      };

      expect(getSortedNotesLenient(state, [])).to.eql([]);
    });

    it('handles notes with no createdDate', () => {
      const state = {
        entities: {
          NOTE_ID_1: {},
          NOTE_ID_2: { createdDate: '1900-01-01T00:01:01.001Z' },
        },
      };
      expect(getSortedNotesLenient(state, ['NOTE_ID_1', 'NOTE_ID_2'])).to.eql([
        {},
        { createdDate: '1900-01-01T00:01:01.001Z' },
      ]);
    });

    it('handles state having no entities field', () => {
      const state = {};
      expect(getSortedNotesLenient(state, ['NOTE_ID_1', 'NOTE_ID_2'])).to.eql([
        null,
        null,
      ]);
    });

    it('handles an empty entities field in state', () => {
      const state = { entities: null };
      expect(getSortedNotesLenient(state, ['NOTE_ID_1', 'NOTE_ID_2'])).to.eql([
        null,
        null,
      ]);
    });

    it('returns an empty list when the list of notes in the request is invalid', () => {
      const state = {
        entities: {
          NOTE_ID_1: { createdDate: '1900-01-01T00:01:01.001Z' },
        },
      };
      expect(getSortedNotesLenient(state, 'INVALID')).to.eql([]);
    });

    it('handles invalid note ids', () => {
      const state = {
        entities: {
          NOTE_ID_1: { createdDate: '1900-01-01T00:01:01.001Z' },
        },
      };
      expect(getSortedNotesLenient(state, [{}, '', 0, false, true, [1], 'NOTE_ID_1'])).to.eql([
        null, null, null, null, null, null, { createdDate: '1900-01-01T00:01:01.001Z' },
      ]);
    });
  });
});
