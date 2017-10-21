import { expect } from 'chai';
import { getSortedUsers } from '../../../../../../frontend/modules/user/users';

const getSortedUsersLenient = getSortedUsers as any;

describe('Users selectors', () => {
  describe('getSortedUsers', () => {
    it('returns a sorted list of users', () => {
      const state = {
        entities: {
          USER_3: { name: 'Ab', id: 'USER_3' },
          USER_1: { name: 'Ac', id: 'USER_1' },
          USER_2: { name: 'Aa', id: 'USER_2' },
        },
      };

      expect(getSortedUsersLenient(state, ['USER_1', 'USER_2', 'USER_3'])).to.eql([
        { name: 'Aa', id: 'USER_2' },
        { name: 'Ab', id: 'USER_3' },
        { name: 'Ac', id: 'USER_1' },
      ]);
    });

    it('ignores users that have not been requested', () => {
      const state = {
        entities: {
          USER_3: { name: 'Ab', id: 'USER_3' },
          USER_1: { name: 'Ac', id: 'USER_1' },
          USER_2: { name: 'Aa', id: 'USER_2' },
        },
      };

      expect(getSortedUsersLenient(state, ['USER_1', 'USER_2'])).to.eql([
        { name: 'Aa', id: 'USER_2' },
        { name: 'Ac', id: 'USER_1' },
      ]);
    });

    it('returns a message when requested users are missing from state', () => {
      expect(getSortedUsersLenient({ entities: [] }, ['USER_1', 'USER_2'])).to.eql([
        { name: 'Missing user', id: 'USER_1' },
        { name: 'Missing user', id: 'USER_2' },
      ]);
    });

    it('returns a message when entities is malformed', () => {
      expect(getSortedUsersLenient({ entities: 'INVALID' }, ['USER_1', 'USER_2'])).to.eql([
        { name: 'Missing user', id: 'USER_1' },
        { name: 'Missing user', id: 'USER_2' },
      ]);
    });

    it('returns a message when entities is missing from state', () => {
      expect(getSortedUsersLenient({ notEntities: true }, ['USER_1', 'USER_2'])).to.eql([
        { name: 'Missing user', id: 'USER_1' },
        { name: 'Missing user', id: 'USER_2' },
      ]);
    });

    it('returns an empty array if no users are requested', () => {
      const state = {
        entities: {
          USER_3: { name: 'Ab', id: 'USER_3' },
          USER_1: { name: 'Ac', id: 'USER_1' },
          USER_2: { name: 'Aa', id: 'USER_2' },
        },
      };

      expect(getSortedUsersLenient(state, [])).to.eql([]);
    });

    it('returns an empty array the userIds argument is malformed', () => {
      const state = {
        entities: {
          USER_3: { name: 'Ab', id: 'USER_3' },
          USER_1: { name: 'Ac', id: 'USER_1' },
          USER_2: { name: 'Aa', id: 'USER_2' },
        },
      };

      expect(getSortedUsersLenient(state, 'INVALID')).to.eql([]);
    });
  });
});
