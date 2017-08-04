import { handleActions, createAction } from 'redux-actions';
import * as keymirror from 'keymirror';
import api from '../../api';

export const constants = keymirror({
  SAVE_TEMPLATE_SUCCESS: null,
  SAVE_TEMPLATE_FAILURE: null,
  SAVE_SKILL_SUCCESS: null,
  SAVE_SKILL_FAILURE: null,
  RETRIEVE_TEMPLATE_SUCCESS: null,
  RETRIEVE_TEMPLATE_FAILURE: null,
});

const saveTemplateSuccess = createAction(constants.SAVE_TEMPLATE_SUCCESS);
const saveTemplateFailure = createAction(constants.SAVE_TEMPLATE_FAILURE);
const saveSkillSuccess = createAction(constants.SAVE_SKILL_SUCCESS);
const saveSkillFailure = createAction(constants.SAVE_SKILL_FAILURE);
const retrieveTemplateSuccess = createAction(constants.RETRIEVE_TEMPLATE_SUCCESS);
const retrieveTemplateFailure = createAction(constants.RETRIEVE_TEMPLATE_FAILURE);

function saveTemplate(template) {
  return dispatch => api.saveTemplate(template)
    .then(savedTemplate => dispatch(saveTemplateSuccess(savedTemplate)))
    .catch(err => dispatch(saveTemplateFailure(err)));
}

function saveSkill(skill) {
  return dispatch => api.saveSkill(skill)
    .then(savedSkill => dispatch(saveSkillSuccess(savedSkill)))
    .catch(err => dispatch(saveSkillFailure(err)));
}

function retrieveTemplate(templateId) {
  return dispatch => Promise.all([api.getTemplate(templateId), api.getSkills()])
    .then(([template, skills]) => dispatch(retrieveTemplateSuccess({ template, skills })))
    .catch(err => dispatch(retrieveTemplateFailure(err)));
}

export const actions = {
  saveTemplate,
  saveSkill,
  retrieveTemplate,
};

const handleSaveTemplateSuccess = (state, action) =>
  Object.assign({}, state, {
    templateResult: { success: true, error: null },
    templates: [].concat(state.templates, action.payload),
  });

const handleRetrieveTemplateSuccess = (state, action) =>
  Object.assign({}, state, {
    retrieved: true,
    templateResult: { success: true, error: null },
    template: action.payload.template,
    skills: action.payload.skills,
    skillGroups: action.payload.template.skillGroups,
  });

export const reducers = handleActions({
  [saveTemplateSuccess]: handleSaveTemplateSuccess,
  [saveTemplateFailure]: (state, action) => Object.assign({}, state, { templateResult: { error: action.payload, success: false } }),
  [saveSkillSuccess]: state => Object.assign({}, state, { skillResult: { success: true, error: null } }),
  [saveSkillFailure]: (state, action) => Object.assign({}, state, { skillResult: { error: action.payload, success: false } }),
  [retrieveTemplateSuccess]: handleRetrieveTemplateSuccess,
  [retrieveTemplateFailure]: (state, action) => Object.assign({}, state, { templateResult: { error: action.payload, success: false } }),
}, { templateResult: {}, skillResult: {} });

