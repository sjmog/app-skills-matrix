import { expect } from 'chai';
import evaluation from '../../backend/models/evaluations/evaluation';
import evaluations from '../fixtures/evaluations';
import reducer, { actionTypes, initialValues } from '../../frontend/modules/user/evaluation';

const fixtureEvaluation = Object.assign({}, evaluations[0], { _id: 'some_evaluation_id' });

describe('Evaluation reducer', () => {
  describe('INIT', () => {
    it('sets the initial state', () => {
      const state = undefined;
      const action = { type: 'INIT' };

      expect(reducer(state, action)).to.eql(initialValues);
    });
  });

  describe('SET_AS_CURRENT_EVALUATION', () => {
    it('sets the ID of the evaluation', () => {
      const state = initialValues;
      const action = {
        type: 'SET_AS_CURRENT_EVALUATION',
        payload: evaluation(fixtureEvaluation).viewModel
      };

      const newState = reducer(state, action);
      expect(newState.evaluationId).to.equal('some_evaluation_id');
    });

    it('sets paginated view of skills in evaluation that are sorted by category and level', () => {
      const state = initialValues;
      const action = {
        type: 'SET_AS_CURRENT_EVALUATION',
        payload: evaluation(fixtureEvaluation).viewModel
      };

      const newState = reducer(state, action);

      expect(newState.paginatedView.length).to.equal(12);

      expect(newState.paginatedView[0].skillId).to.equal(4);
      expect(newState.paginatedView[0].skillGroupId).to.equal(3);
      expect(newState.paginatedView[0].level).to.equal('Novice');
      expect(newState.paginatedView[0].category).to.equal('Magicness');
      expect(newState.paginatedView[0].name).to.equal('Working knowledge of the Dark Arts');
      expect(newState.paginatedView[0].criteria).to.equal('Can execute the Toenail-growing hex');
      expect(newState.paginatedView[0].questions).to.eql([{
        "title": "Have you hexed anyone in the last month?"
      }]);

      expect(newState.paginatedView[1].skillId).to.equal(11);
      expect(newState.paginatedView[1].skillGroupId).to.equal(10);
      expect(newState.paginatedView[1].level).to.equal('Experienced Beginner');
      expect(newState.paginatedView[1].category).to.equal('Magicness');

      expect(newState.paginatedView[2].skillId).to.equal(12);
      expect(newState.paginatedView[2].skillGroupId).to.equal(11);
      expect(newState.paginatedView[2].level).to.equal('Knowledgeable');
      expect(newState.paginatedView[2].category).to.equal('Magicness');

      expect(newState.paginatedView[3].skillId).to.equal(3);
      expect(newState.paginatedView[3].skillGroupId).to.equal(5);
      expect(newState.paginatedView[3].level).to.equal('Expert');
      expect(newState.paginatedView[3].category).to.equal('Magicness');

      expect(newState.paginatedView[4].skillId).to.equal(1);
      expect(newState.paginatedView[4].skillGroupId).to.equal(4);
      expect(newState.paginatedView[4].level).to.equal('Novice');
      expect(newState.paginatedView[4].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[5].skillId).to.equal(9);
      expect(newState.paginatedView[5].skillGroupId).to.equal(8);
      expect(newState.paginatedView[5].level).to.equal('Experienced Beginner');
      expect(newState.paginatedView[5].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[6].skillId).to.equal(10);
      expect(newState.paginatedView[6].skillGroupId).to.equal(9);
      expect(newState.paginatedView[6].level).to.equal('Knowledgeable');
      expect(newState.paginatedView[6].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[7].skillId).to.equal(2);
      expect(newState.paginatedView[7].skillGroupId).to.equal(2);
      expect(newState.paginatedView[7].level).to.equal('Expert');
      expect(newState.paginatedView[7].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[8].skillId).to.equal(5);
      expect(newState.paginatedView[8].skillGroupId).to.equal(0);
      expect(newState.paginatedView[8].level).to.equal('Novice');
      expect(newState.paginatedView[8].category).to.equal('Dragon Slaying');

      expect(newState.paginatedView[9].skillId).to.equal(7);
      expect(newState.paginatedView[9].skillGroupId).to.equal(6);
      expect(newState.paginatedView[9].level).to.equal('Experienced Beginner');
      expect(newState.paginatedView[9].category).to.equal('Dragon Slaying');

      expect(newState.paginatedView[10].skillId).to.equal(8);
      expect(newState.paginatedView[10].skillGroupId).to.equal(7);
      expect(newState.paginatedView[10].level).to.equal('Knowledgeable');
      expect(newState.paginatedView[10].category).to.equal('Dragon Slaying');

      expect(newState.paginatedView[11].skillId).to.equal(6);
      expect(newState.paginatedView[11].skillGroupId).to.equal(1);
      expect(newState.paginatedView[11].level).to.equal('Expert');
      expect(newState.paginatedView[11].category).to.equal('Dragon Slaying');
    });

    it('sets current skill to be the first that is unevaluated', () => {
      const state = initialValues;
      const action = {
        type: 'SET_AS_CURRENT_EVALUATION',
        payload: evaluation(fixtureEvaluation).viewModel
      };

      const newState = reducer(state, action);

      expect(newState.currentSkill.skillId).to.equal(4);
      expect(newState.currentSkill.skillGroupId).to.equal(3);
      expect(newState.currentSkill.level).to.equal('Novice');
      expect(newState.currentSkill.category).to.equal('Magicness');
    });

    it('sets first skill', () => {
      const state = initialValues;
      const action = {
        type: 'SET_AS_CURRENT_EVALUATION',
        payload: evaluation(fixtureEvaluation).viewModel
      };

      const newState = reducer(state, action);
      expect(newState.firstSkill.skillId).to.equal(4);
      expect(newState.firstSkill.skillGroupId).to.equal(3);
      expect(newState.firstSkill.level).to.equal('Novice');
      expect(newState.firstSkill.category).to.equal('Magicness');
    });

    it('sets last skill', () => {
      const state = initialValues;
      const action = {
        type: 'SET_AS_CURRENT_EVALUATION',
        payload: evaluation(fixtureEvaluation).viewModel
      };

      const newState = reducer(state, action);

      expect(newState.lastSkill.skillId).to.equal(6);
      expect(newState.lastSkill.skillGroupId).to.equal(1);
      expect(newState.lastSkill.level).to.equal('Expert');
      expect(newState.lastSkill.category).to.equal('Dragon Slaying');
    });

    it('sets first category', () => {
      const state = initialValues;
      const action = {
        type: 'SET_AS_CURRENT_EVALUATION',
        payload: evaluation(fixtureEvaluation).viewModel
      };

      const newState = reducer(state, action);
      expect(newState.firstCategory).to.equal('Magicness');
    });

    it('sets last category', () => {
      const state = initialValues;
      const action = {
        type: 'SET_AS_CURRENT_EVALUATION',
        payload: evaluation(fixtureEvaluation).viewModel
      };

      const newState = reducer(state, action);
      expect(newState.lastCategory).to.equal('Dragon Slaying');
    });
  })
});
