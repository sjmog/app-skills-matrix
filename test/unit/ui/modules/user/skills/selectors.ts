import { expect } from 'chai';
import { getErringSkills, getSkillsWithCurrentStatus } from '../../../../../../frontend/modules/user/skills';

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

  describe('getSkillsWithCurrentStatus', () => {
    it('returns the uids for skills have the specified status', () => {
      const state = {
        entities: {
          SKILL_ID_1: { status: { current: 'A' } },
          SKILL_ID_2: { status: { current: 'B' } },
        },
      };

      expect(getSkillsWithCurrentStatus(state, 'A', ['SKILL_ID_1', 'SKILL_ID_2'])).to.eql(['SKILL_ID_1']);
    });

    it('returns an empty list when there are no skills with the specified status', () => {
      const state = {
        entities: {
          SKILL_ID_1: { status: { current: 'B' } },
          SKILL_ID_2: { status: { current: 'B' } },
        },
      };

      expect(getSkillsWithCurrentStatus(state, 'A', ['SKILL_ID_1', 'SKILL_ID_2'])).to.eql([]);
    });

    it('ignores skills that have the specified status but are not in the specified list of skills', () => {
      const state = {
        entities: {
          SKILL_ID_1: { status: { current: 'B' } },
          SKILL_ID_2: { status: { current: 'A' } },
        },
      };

      expect(getSkillsWithCurrentStatus(state, 'A', ['SKILL_ID_1'])).to.eql([]);
    });

    it('returns an empty array when the list of skills is empty', () => {
      const state = {
        entities: {
          SKILL_ID_1: { status: { current: 'A' } },
        },
      };

      expect(getSkillsWithCurrentStatus(state, 'A', [])).to.eql([]);
    });

    it('returns an empty array when there are no matching entities for specified skills', () => {
      const state = {
        entities: {
          SKILL_ID_1: { status: { current: 'A' } },
          SKILL_ID_2: { status: { current: 'A' } },
        },
      };

      expect(getSkillsWithCurrentStatus(state, 'A', ['SKILL_ID_3'])).to.eql([]);
    });

    it('returns an empty array when state has no entities property', () => {
      expect(getSkillsWithCurrentStatus({}, 'A', ['SKILL_ID_1'])).to.eql([]);
    });

    it('returns an empty array when entities is empty', () => {
      const state = {
        entities: {},
      };

      expect(getSkillsWithCurrentStatus(state, 'A', ['SKILL_ID_1'])).to.eql([]);
    });

    it('ignores skills that are malformed', () => {
      const state = {
        entities: {
          SKILL_ID_1: { INVALID: [] },
          SKILL_ID_2: { status: { INVALID: 'A' } },
          SKILL_ID_3: { status: { current: 'A' } },
        },
      };

      expect(getSkillsWithCurrentStatus(state, 'A', ['SKILL_ID_1', 'SKILL_ID_2', 'SKILL_ID_3'])).to.eql(['SKILL_ID_3']);
    });
  });
});
