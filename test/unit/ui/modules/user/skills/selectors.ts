import { expect } from 'chai';
import { getErringSkills, getSkillsWithCurrentStatus, getSkillNames } from '../../../../../../frontend/modules/user/skills';

const getSkillNamesLenient = getSkillNames as any;

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

  describe('getSkillNames', () => {
    it('returns a list of skill names', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'One' },
          SKILL_ID_2: { name: 'Two' },
        },
      };

      expect(getSkillNames(state, ['SKILL_ID_1', 'SKILL_ID_2'])).to.eql(['One', 'Two']);
    });

    it('returns a default name when a skill is malformed', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'One' },
          SKILL_ID_2: { no: 'name' },
        },
      };

      expect(getSkillNamesLenient(state, ['SKILL_ID_1', 'SKILL_ID_2'])).to.eql(['One', 'Malformed skill: SKILL_ID_2']);
    });

    it('returns a missing skill message when a skill is not present', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'One' },
        },
      };

      expect(getSkillNamesLenient(state, ['SKILL_ID_2'])).to.eql(['Unable to find skill details: SKILL_ID_2']);
    });

    it('returns a missing skill message when there is no entities property', () => {
      const state = {
        notEntities: true,
      };

      expect(getSkillNamesLenient(state, ['SKILL_ID_1'])).to.eql(['Unable to find skill details: SKILL_ID_1']);
    });

    it('returns a missing skill message when the entities value is malformed', () => {
      const state = {
        entities: ['INVALID'],
      };

      expect(getSkillNamesLenient(state, ['SKILL_ID_1'])).to.eql(['Unable to find skill details: SKILL_ID_1']);
    });

    it('returns null when the skillUids arg is invalid', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'One' },
          SKILL_ID_2: { name: 'Two' },
        },
      };

      expect(getSkillNamesLenient(state, 'INVALID')).to.eql(null);
    });

    it('returns an empty array when the list of skillUids is empty', () => {
      const state = {
        entities: {
          SKILL_ID_1: { name: 'One' },
          SKILL_ID_2: { name: 'Two' },
        },
      };

      expect(getSkillNamesLenient(state, [])).to.eql([]);
    });
  });
});
