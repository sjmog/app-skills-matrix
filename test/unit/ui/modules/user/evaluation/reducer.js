import { expect } from 'chai';
import R from 'ramda';
import evaluationModel from '../../../../../../backend/models/evaluations/evaluation';
import evaluations from '../../../../../fixtures/evaluations.json';
import reducer, { actionTypes, initialValues } from '../../../../../../frontend/modules/user/evaluation';

const evalId = 'some_evaluation_id';
const fixtureEvaluation = Object.assign({}, evaluations[0], { _id: evalId });

const evaluationViewModel = evaluationModel(fixtureEvaluation).viewModel;
const evaluation = evaluationViewModel;
const skills = R.prop('skills', evaluationViewModel);

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
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills },
      };

      const newState = reducer(state, action);
      expect(newState.evaluationId).to.equal('some_evaluation_id');
    });

    it('sets paginated view of skills in evaluation that are sorted by category and level', () => {
      const state = initialValues;
      const action = {
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills },
      };

      const newState = reducer(state, action);

      expect(newState.paginatedView.length).to.equal(12);

      expect(newState.paginatedView[0].skillUid).to.equal(`${evalId}_4`);
      expect(newState.paginatedView[0].id).to.equal(4);
      expect(newState.paginatedView[0].skillGroupId).to.equal(3);
      expect(newState.paginatedView[0].level).to.equal('Novice');
      expect(newState.paginatedView[0].category).to.equal('Magicness');
      expect(newState.paginatedView[0].name).to.equal('Working knowledge of the Dark Arts');
      expect(newState.paginatedView[0].criteria).to.equal('Can execute the Toenail-growing hex');
      expect(newState.paginatedView[0].questions).to.eql([
        {
          title: 'Have you hexed anyone in the last month?',
        },
      ]);

      expect(newState.paginatedView[1].id).to.equal(11);
      expect(newState.paginatedView[1].skillGroupId).to.equal(10);
      expect(newState.paginatedView[1].level).to.equal('Experienced Beginner');
      expect(newState.paginatedView[1].category).to.equal('Magicness');

      expect(newState.paginatedView[2].id).to.equal(12);
      expect(newState.paginatedView[2].skillGroupId).to.equal(11);
      expect(newState.paginatedView[2].level).to.equal('Knowledgeable');
      expect(newState.paginatedView[2].category).to.equal('Magicness');

      expect(newState.paginatedView[3].id).to.equal(3);
      expect(newState.paginatedView[3].skillGroupId).to.equal(5);
      expect(newState.paginatedView[3].level).to.equal('Expert');
      expect(newState.paginatedView[3].category).to.equal('Magicness');

      expect(newState.paginatedView[4].id).to.equal(1);
      expect(newState.paginatedView[4].skillGroupId).to.equal(4);
      expect(newState.paginatedView[4].level).to.equal('Novice');
      expect(newState.paginatedView[4].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[5].id).to.equal(9);
      expect(newState.paginatedView[5].skillGroupId).to.equal(8);
      expect(newState.paginatedView[5].level).to.equal('Experienced Beginner');
      expect(newState.paginatedView[5].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[6].id).to.equal(10);
      expect(newState.paginatedView[6].skillGroupId).to.equal(9);
      expect(newState.paginatedView[6].level).to.equal('Knowledgeable');
      expect(newState.paginatedView[6].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[7].id).to.equal(2);
      expect(newState.paginatedView[7].skillGroupId).to.equal(2);
      expect(newState.paginatedView[7].level).to.equal('Expert');
      expect(newState.paginatedView[7].category).to.equal('Dragon Flight');

      expect(newState.paginatedView[8].id).to.equal(5);
      expect(newState.paginatedView[8].skillGroupId).to.equal(0);
      expect(newState.paginatedView[8].level).to.equal('Novice');
      expect(newState.paginatedView[8].category).to.equal('Dragon Slaying');

      expect(newState.paginatedView[9].id).to.equal(7);
      expect(newState.paginatedView[9].skillGroupId).to.equal(6);
      expect(newState.paginatedView[9].level).to.equal('Experienced Beginner');
      expect(newState.paginatedView[9].category).to.equal('Dragon Slaying');

      expect(newState.paginatedView[10].id).to.equal(8);
      expect(newState.paginatedView[10].skillGroupId).to.equal(7);
      expect(newState.paginatedView[10].level).to.equal('Knowledgeable');
      expect(newState.paginatedView[10].category).to.equal('Dragon Slaying');

      expect(newState.paginatedView[11].id).to.equal(6);
      expect(newState.paginatedView[11].skillGroupId).to.equal(1);
      expect(newState.paginatedView[11].level).to.equal('Expert');
      expect(newState.paginatedView[11].category).to.equal('Dragon Slaying');
    });

    it('sets current skill to be the first that is unevaluated', () => {
      const state = initialValues;
      const action = {
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills },
      };

      const newState = reducer(state, action);

      expect(newState.currentSkill.id).to.equal(4);
      expect(newState.currentSkill.skillGroupId).to.equal(3);
      expect(newState.currentSkill.level).to.equal('Novice');
      expect(newState.currentSkill.category).to.equal('Magicness');
    });

    it('sets current skill to be the last when all have been evaluated', () => {
      const state = initialValues;

      const setStatusToAttained = skill => Object.assign({}, skill, { status: { current: 'ATTAINED' } });
      const evaluatedSkills = R.map(setStatusToAttained)(skills);

      const action = {
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills: evaluatedSkills },
      };

      const newState = reducer(state, action);

      expect(newState.currentSkill.id).to.equal(6);
      expect(newState.currentSkill.skillGroupId).to.equal(1);
      expect(newState.currentSkill.level).to.equal('Expert');
      expect(newState.currentSkill.category).to.equal('Dragon Slaying');
    });

    it('sets first skill', () => {
      const state = initialValues;
      const action = {
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills },
      };

      const newState = reducer(state, action);
      expect(newState.firstSkill.id).to.equal(4);
      expect(newState.firstSkill.skillGroupId).to.equal(3);
      expect(newState.firstSkill.level).to.equal('Novice');
      expect(newState.firstSkill.category).to.equal('Magicness');
    });

    it('sets last skill', () => {
      const state = initialValues;
      const action = {
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills },
      };

      const newState = reducer(state, action);

      expect(newState.lastSkill.id).to.equal(6);
      expect(newState.lastSkill.skillGroupId).to.equal(1);
      expect(newState.lastSkill.level).to.equal('Expert');
      expect(newState.lastSkill.category).to.equal('Dragon Slaying');
    });

    it('sets first category', () => {
      const state = initialValues;
      const action = {
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills },
      };

      const newState = reducer(state, action);
      expect(newState.firstCategory).to.equal('Magicness');
    });

    it('sets last category', () => {
      const state = initialValues;
      const action = {
        type: actionTypes.SET_AS_CURRENT_EVALUATION,
        payload: { evaluation, skills },
      };

      const newState = reducer(state, action);
      expect(newState.lastCategory).to.equal('Dragon Slaying');
    });
  });

  describe('NEXT_SKILL', () => {
    it('sets current skill to be the next skill in the paginated view', () => {
      const state = {
        paginatedView: [{ skillUid: 1 }, { skillUid: 0 }, { skillUid: 2 }],
        currentSkill: { skillUid: 1 },
        lastSkill: { skillUid: 2 },
      };
      const action = { type: actionTypes.NEXT_SKILL };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 0 });
    });

    it('does not update current skill when current is the last skill', () => {
      const state = {
        paginatedView: [{ skillUid: 1 }, { skillUid: 0 }, { skillUid: 2 }],
        currentSkill: { skillUid: 2 },
        lastSkill: { skillUid: 2 },
      };
      const action = { type: actionTypes.NEXT_SKILL };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 2 });
    });
  });

  describe('PREVIOUS_SKILL', () => {
    it('sets current skill to be the previous skill in the paginated view', () => {
      const state = {
        paginatedView: [{ skillUid: 1 }, { skillUid: 0 }, { skillUid: 2 }],
        currentSkill: { skillUid: 0 },
        firstSkill: { skillUid: 1 },
      };
      const action = { type: actionTypes.PREVIOUS_SKILL };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 1 });
    });

    it('does not update current skill when current is the first skill', () => {
      const state = {
        paginatedView: [{ skillUid: 1 }, { skillUid: 0 }, { skillUid: 2 }],
        currentSkill: { skillUid: 1 },
        firstSkill: { skillUid: 1 },
      };

      const action = { type: actionTypes.PREVIOUS_SKILL };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 1 });
    });
  });

  describe('NEXT_UNEVALUATED_SKILL', () => {
    it('sets current skill to be the next skill that has not been evaluated', () => {
      const state = {
        paginatedView: [{ skillUid: 1 }, { skillUid: 0 }, { skillUid: 2 }],
        currentSkill: { skillUid: 1 },
        lastSkill: { skillUid: 2 },
      };

      const action = {
        type: actionTypes.NEXT_UNEVALUATED_SKILL,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          1: {
            id: 1,
            status: {
              current: null,
              previous: null,
            },
          },
          2: {
            id: 2,
            status: {
              current: null,
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 2 });
    });

    it('sets current skill to last skill when all remaining skills have been evaluated', () => {
      const state = {
        paginatedView: [{ skillUid: 1 }, { skillUid: 0 }, { skillUid: 2 }],
        currentSkill: { skillUid: 1 },
        lastSkill: { skillUid: 2 },
      };

      const action = {
        type: actionTypes.NEXT_UNEVALUATED_SKILL,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          1: {
            id: 1,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          2: {
            id: 2,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 2 });
    });

    it('does not update current skill when it is the last skill', () => {
      const state = {
        paginatedView: [{ skillUid: 1 }, { skillUid: 0 }, { skillUid: 2 }],
        currentSkill: { skillUid: 2 },
        lastSkill: { skillUid: 2 },
      };

      const action = {
        type: actionTypes.NEXT_UNEVALUATED_SKILL,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          1: {
            id: 1,
            status: {
              current: null,
              previous: null,
            },
          },
          2: {
            id: 2,
            status: {
              current: null,
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 2 });
    });
  });

  describe('NEXT_CATEGORY', () => {
    it('sets current skill to the first unevaluated skill in the next category', () => {
      const state = {
        paginatedView: [
          { skillUid: 0, category: 'Magicness' },
          { skillUid: 1, category: 'Dragon Flight' },
          { skillUid: 2, category: 'Dragon Flight' },
          { skillUid: 3, category: 'Dragon Flight' },
        ],
        currentSkill: { skillUid: 0, category: 'Magicness' },
        lastCategory: 'Dragon Flight',
      };

      const action = {
        type: actionTypes.NEXT_CATEGORY,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          1: {
            id: 1,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          2: {
            id: 2,
            status: {
              current: null,
              previous: null,
            },
          },
          3: {
            id: 3,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 2, category: 'Dragon Flight' });
    });

    it('sets current skill to last skill in the next category when all skills have been evaluated', () => {
      const state = {
        paginatedView: [
          { skillUid: 0, category: 'Magicness' },
          { skillUid: 1, category: 'Dragon Flight' },
          { skillUid: 2, category: 'Dragon Flight' },
          { skillUid: 3, category: 'Dragon Slaying' },
        ],
        currentSkill: { skillUid: 0, category: 'Magicness' },
        lastCategory: 'Dragon Slaying',
      };

      const action = {
        type: actionTypes.NEXT_CATEGORY,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          1: {
            id: 1,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          2: {
            id: 2,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          3: {
            id: 3,
            status: {
              current: null,
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 2, category: 'Dragon Flight' });
    });

    it('does not update current skill when current is in the last category', () => {
      const state = {
        paginatedView: [
          { skillUid: 0, category: 'Magicness' },
        ],
        currentSkill: { skillUid: 0, category: 'Magicness' },
        lastCategory: 'Magicness',
      };

      const action = {
        type: actionTypes.NEXT_CATEGORY,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 0, category: 'Magicness' });
    });
  });

  describe('PREVIOUS_CATEGORY', () => {
    it('sets current skill to the first unevaluated skill in the previous category', () => {
      const state = {
        paginatedView: [
          { skillUid: 0, category: 'Magicness' },
          { skillUid: 1, category: 'Magicness' },
          { skillUid: 2, category: 'Dragon Flight' },
        ],
        currentSkill: { skillUid: 2, category: 'Dragon Flight' },
        firstCategory: 'Magicness',
      };

      const action = {
        type: actionTypes.PREVIOUS_CATEGORY,
        payload: {
          0: {
            id: 0,
            status: {
              current: null,
              previous: null,
            },
          },
          1: {
            id: 1,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          2: {
            id: 2,
            status: {
              current: null,
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 0, category: 'Magicness' });
    });

    it('sets current skill to last skill in the previous category when all skills have been evaluated', () => {
      const state = {
        paginatedView: [
          { skillUid: 0, category: 'Magicness' },
          { skillUid: 1, category: 'Magicness' },
          { skillUid: 2, category: 'Dragon Flight' },
        ],
        currentSkill: { skillUid: 2, category: 'Dragon Flight' },
        firstCategory: 'Magicness',
      };

      const action = {
        type: actionTypes.PREVIOUS_CATEGORY,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          1: {
            id: 1,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
          2: {
            id: 2,
            status: {
              current: null,
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 1, category: 'Magicness' });
    });

    it('does not update current skill when current is in the first category', () => {
      const state = {
        paginatedView: [
          { skillUid: 0, category: 'Magicness' },
        ],
        currentSkill: { skillUid: 0, category: 'Magicness' },
        firstCategory: 'Magicness',
      };

      const action = {
        type: actionTypes.PREVIOUS_CATEGORY,
        payload: {
          0: {
            id: 0,
            status: {
              current: 'ATTAINED',
              previous: null,
            },
          },
        },
      };

      const newState = reducer(state, action);
      expect(newState.currentSkill).to.eql({ skillUid: 0, category: 'Magicness' });
    });
  });
});
