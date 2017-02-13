import { handleActions, createAction } from 'redux-actions';
import { combineReducers } from 'redux';
import keymirror from 'keymirror';
import api from '../api';

export const constants = keymirror({
  ADD_TEMPLATE_SUCCESS: null,
  ADD_TEMPLATE_FAILURE: null,
  ADD_SKILL_SUCCESS: null,
  ADD_SKILL_FAILURE: null,
});

const addTemplateSuccess = createAction(constants.ADD_TEMPLATE_SUCCESS);
const addTemplateFailure = createAction(constants.ADD_TEMPLATE_FAILURE);
const addSkillSuccess = createAction(constants.ADD_SKILL_SUCCESS);
const addSkillFailure = createAction(constants.ADD_SKILL_FAILURE);

function addTemplate(template) {
  return function (dispatch) {
    return api.saveTemplate(template)
      .then((savedTemplate) => dispatch(addTemplateSuccess(savedTemplate)))
      .catch((err) => dispatch(addTemplateFailure(err)))
  }
}

function addSkill(skill) {
  return function (dispatch) {
    return api.saveSkill(skill)
      .then((savedSkill) => dispatch(addSkillSuccess(savedSkill)))
      .catch((err) => dispatch(addSkillFailure(err)))
  }
}

export const actions = {
  addTemplate,
  addSkill,
};

export const reducers = handleActions({
  [addTemplateSuccess]: (state, action) => Object.assign({}, state, { template: { success: true, error: null } }),
  [addTemplateFailure]: (state, action) => Object.assign({}, state, { template: { error: action.payload, success: false } }),
  [addSkillSuccess]: (state, action) => Object.assign({}, state, { skill: { success: true, error: null } }),
  [addSkillFailure]: (state, action) => Object.assign({}, state, { skill: { error: action.payload, success: false } }),
}, { template: {}, skill: {} });



