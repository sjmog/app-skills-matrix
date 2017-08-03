import { expect } from 'chai';
import reducer, { actionTypes } from '../../../../../../frontend/modules/user/skills';

describe('Skills reducer', () => {
  describe('SKILL_STATUS_UPDATE_SUCCESS', () => {
    it('updates the current status of a skill', () => {
      const state = {
        entities: {
          SKILL_ID: { status: { current: null, previous: null } },
        },
        errors: {},
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_SUCCESS,
        payload: { skillUid: 'SKILL_ID', status: 'NEW_STATUS' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          SKILL_ID: { status: { current: 'NEW_STATUS', previous: null } },
        },
        errors: {},
      });
    });

    it('clears any existing errors for a skill on a successful update', () => {
      const state = {
        entities: {
          SKILL_ID: { status: { current: null, previous: null } },
        },
        errors: {
          SKILL_ID: 'MSG',
        },
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_SUCCESS,
        payload: { skillUid: 'SKILL_ID', status: 'NEW_STATUS' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          SKILL_ID: { status: { current: 'NEW_STATUS', previous: null } },
        },
        errors: {},
      });
    });
  });

  describe('SKILL_STATUS_UPDATE_FAILURE', () => {
    it('adds an error with a message', () => {
      const state = {
        errors: {},
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID', error: { message: 'MSG' } },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID: 'MSG' } });
    });

    it('sets the message to unknown when the error has no message', () => {
      const state = {
        errors: {},
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID', error: 'foo' },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID: 'unknown' } });
    });

    it('adds a new error when there is a failure for a different skill', () => {
      const state = {
        errors: {
          SKILL_ID_1: 'MSG_1',
        },
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID_2', error: { message: 'MSG_2' } },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID_1: 'MSG_1', SKILL_ID_2: 'MSG_2' } });
    });

    it('overrides an existing error for a skill when there is another failure', () => {
      const state = {
        errors: {
          SKILL_ID: 'MSG_1',
        },
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID', error: { message: 'MSG_2' } },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID: 'MSG_2' } });
    });
  });
});
