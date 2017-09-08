import { expect } from 'chai';
import { getFeedbackUrlForLatestEval, getObjectivesUrlForLatestEval } from '../../../../../../frontend/modules/user/user';

const getFeedbackUrlForLatestEvalLenient = getFeedbackUrlForLatestEval as any;
const getObjectivesUrlForLatestEvalLenient = getObjectivesUrlForLatestEval as any;

describe('User selectors', () => {
  describe('getFeedbackUrlForLatestEval', () => {
    it('returns the feedbackUrl for the first evaluation in list of evaluations', () => {
      const state = { evaluations: [{ feedbackUrl: '/foo/bar' }] };
      expect(getFeedbackUrlForLatestEvalLenient(state)).to.eql('/foo/bar');
    });

    it('returns null when there are no evaluations', () => {
      const state = {};
      expect(getFeedbackUrlForLatestEvalLenient(state)).to.eql(null);
    });

    it('returns null when evaluations value is not an array', () => {
      ['abc', {}, false, true, 0, { a: 'a' }, undefined, null, new Date()].forEach((invalidVal) => {
        expect(getFeedbackUrlForLatestEvalLenient({ evaluations: invalidVal })).to.eql(null);
      });
    });

    it('returns null when evaluation has no feedbackUrl', () => {
      const state = { evaluations: [{ no_feedback_url: '/bad-times/' }] };
      expect(getFeedbackUrlForLatestEvalLenient(state)).to.eql(null);
    });

    it('returns null when evaluation is not an object', () => {
      const state = { evaluations: [null, undefined, false, true, 0, 1, 'a', [], ['a']] };
      expect(getFeedbackUrlForLatestEvalLenient(state)).to.eql(null);
    });

    it('returns null when feedbackUrl is not a string', () => {
      [[1], {}, false, true, 0, { a: 'a' }, undefined, null, new Date()].forEach((invalidVal) => {
        expect(getFeedbackUrlForLatestEvalLenient({ evaluations: [{ feedbackUrl: invalidVal }] })).to.eql(null);
      });
    });
  });

  describe('getObjectivesUrlForLatestEval', () => {
    it('returns the objectivesUrl for the first evaluation in list of evaluations', () => {
      const state = { evaluations: [{ objectivesUrl: '/foo/bar' }] };
      expect(getObjectivesUrlForLatestEvalLenient(state)).to.eql('/foo/bar');
    });

    it('returns null when there are no evaluations', () => {
      const state = {};
      expect(getObjectivesUrlForLatestEvalLenient(state)).to.eql(null);
    });

    it('returns null when evaluations value is not an array', () => {
      ['abc', {}, false, true, 0, { a: 'a' }, undefined, null, new Date()].forEach((invalidVal) => {
        expect(getObjectivesUrlForLatestEvalLenient({ evaluations: invalidVal })).to.eql(null);
      });
    });

    it('returns null when evaluation has no objectivesUrl', () => {
      const state = { evaluations: [{ no_objectives_url: '/bad-times/' }] };
      expect(getObjectivesUrlForLatestEvalLenient(state)).to.eql(null);
    });

    it('returns null when evaluation is not an object', () => {
      const state = { evaluations: [null, undefined, false, true, 0, 1, 'a', [], ['a']] };
      expect(getObjectivesUrlForLatestEvalLenient(state)).to.eql(null);
    });

    it('returns null when objectivesUrl is not a string', () => {
      [[1], {}, false, true, 0, { a: 'a' }, undefined, null, new Date()].forEach((invalidVal) => {
        expect(getObjectivesUrlForLatestEvalLenient({ evaluations: [{ objectivesUrl: invalidVal }] })).to.eql(null);
      });
    });
  });
});
