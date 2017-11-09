import { expect } from 'chai';
import reducer, { actionTypes } from '../../../../../../frontend/modules/admin/evaluations';
import { constants as userActionTypes } from '../../../../../../frontend/modules/admin/users';

describe('Evaluations reducer', () => {
  describe('STATUS_UPDATE_SUCCESS', () => {
    it('replaces an existing evaluation', () => {
      const state = {
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
        },
        errors: {},
      });
    });

    it('does not modify evaluations that have not been updated', () => {
      const state = {
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
          EVAL_2: { id: 'EVAL_2', status: 'OLD' },
        },
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
          EVAL_2: { id: 'EVAL_2', status: 'OLD' },
        },
        errors: {},
      });
    });

    it('clears existing errors that resulted from STATUS_UPDATE_FAILURE actions', () => {
      const state = {
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },

        errors: {
          STATUS_UPDATE_FAILURE: 'OLD ERROR',
          ANOTHER_ACTION_FAILURE: 'ERROR',
        },
      };
      const action = {
        type: actionTypes.STATUS_UPDATE_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
        },

        errors: {
          ANOTHER_ACTION_FAILURE: 'ERROR',
        },
      });
    });

    it('updates state when the evaluation is missing', () => {
      const state = {
        entities: {},
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_SUCCESS,
        payload: { id: 'EVAL_MISSING', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_MISSING: { id: 'EVAL_MISSING', status: 'NEW' },
        },
        errors: {},
      });
    });

    it('does not modify state when the action payload is missing id', () => {
      const state = {
        entities: { EVAL_1: { id: 'EVAL_1', status: 'OLD' } },
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_SUCCESS,
        payload: { NOT_EVALUATION: true, status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },
        errors: {},
      });
    });

    it('does not modify state when the action payload empty', () => {
      const state = {
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_SUCCESS,
        payload: undefined,
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },
        errors: {},
      });
    });

    it('adds an evaluation to state when entities is malformed', () => {
      const state = {
        entities: undefined,
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_SUCCESS,
        payload: { id: 'EVAL_1', NOT_STATUS: true },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', NOT_STATUS: true },
        },
        errors: {},
      });
    });
  });

  describe('STATUS_UPDATE_FAILURE', () => {
    it('adds an error message for the action', () => {
      const state = {
        notErrors: true,
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_FAILURE,
        payload: { message: 'AN ERROR' },
      };

      expect(reducer(state, action)).to.eql({
        notErrors: true,
        errors: {
          STATUS_UPDATE_FAILURE: 'AN ERROR',
        },
      });
    });

    it('sets a default message if the action payload does not contain a message', () => {
      const state = {
        errors: {},
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_FAILURE,
        payload: undefined,
      };

      const newState = reducer(state, action);
      expect(newState.errors).to.have.property('STATUS_UPDATE_FAILURE');
      expect(newState.errors.STATUS_UPDATE_FAILURE).to.be.a('string').with.length.above(5);
    });

    it('does not modify errors that resulted from other actions', () => {
      const state = {
        errors: {
          ANOTHER_ACTION: true,
        },
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_FAILURE,
        payload: { message: 'AN ERROR' },
      };

      expect(reducer(state, action)).to.eql({
        errors: {
          ANOTHER_ACTION: true,
          STATUS_UPDATE_FAILURE: 'AN ERROR',
        },
      });
    });

    it('adds an error when errors in state is malformed', () => {
      const state = {
        errors: 'INVALID',
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_FAILURE,
        payload: { message: 'AN ERROR' },
      };

      expect(reducer(state, action)).to.eql({
        errors: {
          STATUS_UPDATE_FAILURE: 'AN ERROR',
        },
      });
    });

    it('adds an error when errors do not exist in state', () => {
      const state = {
        NOT_ERRORS: true,
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_FAILURE,
        payload: { message: 'AN ERROR' },
      };

      expect(reducer(state, action)).to.eql({
        NOT_ERRORS: true,
        errors: {
          STATUS_UPDATE_FAILURE: 'AN ERROR',
        },
      });
    });

    it('adds an error when errors is empty', () => {
      const state = {
        errors: undefined,
      };

      const action = {
        type: actionTypes.STATUS_UPDATE_FAILURE,
        payload: { message: 'AN ERROR' },
      };

      expect(reducer(state, action)).to.eql({
        errors: {
          STATUS_UPDATE_FAILURE: 'AN ERROR',
        },
      });
    });
  });

  describe('START_EVALUATION_SUCCESS', () => {
    it('adds an evaluation to state', () => {
      const state = {
        entities: {},
        errors: {},
      };

      const action = {
        type: userActionTypes.START_EVALUATION_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
        },
        errors: {},
      });
    });

    it('replaces any evaluations that existed with the same id', () => {
      const state = {
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },
        errors: {},
      };

      const action = {
        type: userActionTypes.START_EVALUATION_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
        },
        errors: {},
      });
    });

    it('does not modify state when the payload is malformed', () => {
      const state = {
        entities: {},
        errors: {},
      };

      const action = {
        type: userActionTypes.START_EVALUATION_SUCCESS,
        payload: { NO_ID: true },
      };

      expect(reducer(state, action)).to.eql({
        entities: {},
        errors: {},
      });
    });

    it('does not alter other parts of state', () => {
      const state = {
        entities: {},
        errors: {
          ERROR: true,
        },
      };

      const action = {
        type: userActionTypes.START_EVALUATION_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
        },
        errors: {
          ERROR: true,
        },
      });
    });

    it('adds an evaluation entity when entities is empty', () => {
      const state = {
        entities: undefined,
        errors: {},
      };

      const action = {
        type: userActionTypes.START_EVALUATION_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
        },
        errors: {},
      });
    });

    it('adds an evaluation entity when entities does not exist', () => {
      const state = {
        errors: {},
      };

      const action = {
        type: userActionTypes.START_EVALUATION_SUCCESS,
        payload: { id: 'EVAL_1', status: 'NEW' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'NEW' },
        },
        errors: {},
      });
    });

    it('does not modify state when the payload is empty', () => {
      const state = {
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },
        errors: {},
      };

      const action = {
        type: userActionTypes.START_EVALUATION_SUCCESS,
        payload: undefined,
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          EVAL_1: { id: 'EVAL_1', status: 'OLD' },
        },
        errors: {},
      });
    });
  });
});
