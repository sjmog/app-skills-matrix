import { handleActions, createAction } from 'redux-actions';
import keymirror from 'keymirror';
import api from '../api';

export const constants = keymirror({
  SAVE_TEMPLATE_SUCCESS: null,
  SAVE_TEMPLATE_FAILURE: null,
  SAVE_SKILL_SUCCESS: null,
  SAVE_SKILL_FAILURE: null,
});

const saveTemplateSuccess = createAction(constants.SAVE_TEMPLATE_SUCCESS);
const saveTemplateFailure = createAction(constants.SAVE_TEMPLATE_FAILURE);
const saveSkillSuccess = createAction(constants.SAVE_SKILL_SUCCESS);
const saveSkillFailure = createAction(constants.SAVE_SKILL_FAILURE);

function saveTemplate(template) {
  return function (dispatch) {
    return api.saveTemplate(template)
      .then((savedTemplate) => dispatch(saveTemplateSuccess(savedTemplate)))
      .catch((err) => dispatch(saveTemplateFailure(err)))
  }
}

function saveSkill(skill) {
  return function (dispatch) {
    return api.saveSkill(skill)
      .then((savedSkill) => dispatch(saveSkillSuccess(savedSkill)))
      .catch((err) => dispatch(saveSkillFailure(err)))
  }
}

export const actions = {
  saveTemplate,
  saveSkill,
};

export const reducers = handleActions({
  [saveTemplateSuccess]: (state, action) => Object.assign({}, state, { template: { success: true, error: null } }),
  [saveTemplateFailure]: (state, action) => Object.assign({}, state, { template: { error: action.payload, success: false } }),
  [saveSkillSuccess]: (state, action) => Object.assign({}, state, { skill: { success: true, error: null } }),
  [saveSkillFailure]: (state, action) => Object.assign({}, state, { skill: { error: action.payload, success: false } }),
}, { template: {}, skill: {} });



