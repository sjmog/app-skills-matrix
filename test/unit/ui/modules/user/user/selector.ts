import { expect } from 'chai';
import {
  getFeedbackUrlForLatestEval,
} from '../../../../../../frontend/modules/user/user';

describe('User selectors', () => {
  describe('getFeedbackUrlForLatestEval', () => {
    it('returns the feedbackUrl for the first evaluation in list of evaluations', () => {
      const state = { evaluations: [{ feedbackUrl: '/foo/bar' }] };
      expect(getFeedbackUrlForLatestEval(state)).to.eql('/foo/bar');
    });

    it('returns null when there are no evaluations', () => {
      const state = {};
      expect(getFeedbackUrlForLatestEval(state)).to.eql(null);
    });

    it('returns null when evaluations value is not an array', () => {
      ['abc', {}, false, true, 0, { a: 'a' }, undefined, null, new Date()].forEach((invalidVal) => {
        expect(getFeedbackUrlForLatestEval({ evaluations: invalidVal })).to.eql(null);
      });
    });

    it('returns null when evaluation has no feedbackUrl', () => {
      const state = { evaluations: [{ no_feedback_url: '/bad-times/' }] };
      expect(getFeedbackUrlForLatestEval(state)).to.eql(null);
    });

    it('returns null when evaluation is not an object', () => {
      const state = { evaluations: [null, undefined, false, true, 0, 1, 'a', [], ['a']] };
      expect(getFeedbackUrlForLatestEval(state)).to.eql(null);
    });

    it('returns null when feedbackUrl is not a string', () => {
      [[1], {}, false, true, 0, { a: 'a' }, undefined, null, new Date()].forEach((invalidVal) => {
        expect(getFeedbackUrlForLatestEval({ evaluations: [{ feedbackUrl: invalidVal }] })).to.eql(null);
      });
    });
  });
});
