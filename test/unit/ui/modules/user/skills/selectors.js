import { expect } from 'chai';
import { getErringSkills } from '../../../../../../frontend/modules/user/skills';

describe('Skills selectors', () => {
  describe('getErringSkills', () => {
    it('returns a the names of skills we care about that have errors', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'skill one' },
          SKILL_ID_2: { name: 'skill two' },
        },
        errors: {
          SKILL_ID_1: 'MSG_1',
          SKILL_ID_2: 'MSG_2',
        },
      };

      const skillIds = ['SKILL_ID_1', 'SKILL_ID_2'];

      expect(getErringSkills(state, skillIds)).to.eql(['skill one', 'skill two']);
    });

    it('returns an empty list when there are no errors', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'skill one' },
          SKILL_ID_2: { name: 'skill two' },
        },
        errors: {},
      };

      const skillIds = ['SKILL_ID_1', 'SKILL_ID_2'];

      expect(getErringSkills(state, skillIds)).to.eql([]);
    });

    it('does not return the names of skills with errors that we do not care about', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'skill one' },
          SKILL_ID_2: { name: 'skill two' },
        },
        errors: {
          SKILL_ID_1: 'MSG_1',
          SKILL_ID_3: 'MSG_3',
        },
      };

      const skillIds = ['SKILL_ID_1', 'SKILL_ID_2'];

      expect(getErringSkills(state, skillIds)).to.eql(['skill one']);
    });
  });
});
