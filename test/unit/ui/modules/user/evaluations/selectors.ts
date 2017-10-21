import { expect } from 'chai';
import { getSortedEvaluationsByUserId } from '../../../../../../frontend/modules/user/evaluations';

const getSortedEvaluationsByUserIdLenient = getSortedEvaluationsByUserId as any;

describe('Evaluations selectors', () => {
  describe('getSortedEvaluationsByUserId', () => {
    it('returns a list of evaluations that belong to a user, from newest to oldest', () => {
      const state = {
        entities: {
          EVAL_1: { id: 'EVAL_1', createdDate: '1900-01-01T00:01:01.001Z',  subject: { id: 'USER_1' } },
          EVAL_2: { id: 'EVAL_2', createdDate: '1900-01-01T00:01:01.001Z', subject: { id: 'USER_2' } },
          EVAL_3: { id: 'EVAL_3', createdDate: '2000-01-01T00:01:01.001Z', subject: { id: 'USER_2' } },
          EVAL_4: { id: 'EVAL_4', createdDate: '1950-01-01T00:01:01.001Z', subject: { id: 'USER_2' } },
        },
      };

      expect(getSortedEvaluationsByUserIdLenient(state, 'USER_2')).to.eql(['EVAL_3', 'EVAL_4', 'EVAL_2']);
    });

    it('handles evaluations with no createdDate', () => {
      const state = {
        entities: {
          EVAL_2: { id: 'EVAL_2', createdDate: '1900-01-01T00:01:01.001Z', subject: { id: 'USER_2' } },
          EVAL_3: { id: 'EVAL_3', createdDate: '2000-01-01T00:01:01.001Z', subject: { id: 'USER_2' } },
          EVAL_4: { id: 'EVAL_4', subject: { id: 'USER_2' } },
        },
      };

      expect(getSortedEvaluationsByUserIdLenient(state, 'USER_2')).to.eql(['EVAL_3', 'EVAL_2', 'EVAL_4']);
    });

    it('returns an empty array when a user has no evaluations', () => {
      const state = {
        entities: {
          EVAL_2: { id: 'EVAL_2', createdDate: '1900-01-01T00:01:01.001Z', subject: { id: 'USER_1' } },
        },
      };

      expect(getSortedEvaluationsByUserIdLenient(state, 'USER_2')).to.eql([]);
    });

    it('returns an empty array when user ID is empty', () => {
      const state = {
        entities: {
          EVAL_2: { id: 'EVAL_2', createdDate: '1900-01-01T00:01:01.001Z', subject: { id: 'USER_1' } },
        },
      };

      expect(getSortedEvaluationsByUserIdLenient(state, undefined)).to.eql([]);
    });

    it('returns an empty array when entities is missing', () => {
      const state = { notEntities: true };
      expect(getSortedEvaluationsByUserIdLenient(state, 'USER_2')).to.eql([]);
    });

    it('returns an empty array when entities is malformed', () => {
      const state = { entities: 'INVALID' };
      expect(getSortedEvaluationsByUserIdLenient(state, 'USER_2')).to.eql([]);
    });
  });
});
