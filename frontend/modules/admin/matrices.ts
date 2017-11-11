import { handleActions, createAction } from 'redux-actions';
import * as keymirror from 'keymirror';
import api from '../../api';
import * as R from 'ramda';

export const constants = keymirror({
  ADD_TEMPLATE_SUCCESS: null,
  ADD_TEMPLATE_FAILURE: null,
  SAVE_SKILLS_SUCCESS: null,
  SAVE_SKILLS_FAILURE: null,
  ADD_SKILL_SUCCESS: null,
  ADD_SKILL_FAILURE: null,
  REMOVE_SKILL_SUCCESS: null,
  REMOVE_SKILL_FAILURE: null,
  REPLACE_SKILL_SUCCESS: null,
  REPLACE_SKILL_FAILURE: null,
  RETRIEVE_TEMPLATE_SUCCESS: null,
  RETRIEVE_TEMPLATE_FAILURE: null,
});

const addTemplateSuccess = createAction(constants.ADD_TEMPLATE_SUCCESS);
const addTemplateFailure = createAction(constants.ADD_TEMPLATE_FAILURE);
const saveSkillsSuccess = createAction(constants.SAVE_SKILLS_SUCCESS);
const saveSkillsFailure = createAction(constants.SAVE_SKILLS_FAILURE);
const addSkillSuccess = createAction(constants.ADD_SKILL_SUCCESS);
const addSkillFailure = createAction(constants.ADD_SKILL_FAILURE);
const removeSkillSuccess = createAction(constants.REMOVE_SKILL_SUCCESS);
const removeSkillFailure = createAction(constants.REMOVE_SKILL_FAILURE);
const replaceSkillSuccess = createAction(constants.REPLACE_SKILL_SUCCESS);
const replaceSkillFailure = createAction(constants.REPLACE_SKILL_FAILURE);
const retrieveTemplateSuccess = createAction(constants.RETRIEVE_TEMPLATE_SUCCESS);
const retrieveTemplateFailure = createAction(constants.RETRIEVE_TEMPLATE_FAILURE);

type ApiResult = {
  success: boolean,
  error: ErrorMessage,
};

export type MatricesState = {
  templateFetchResult?: ApiResult &
    {
      skills: UnhydratedTemplateSkill[],
      template: NormalizedTemplateViewModel,
    },
  templateAddResult?: ApiResult,
  skillResult: ApiResult,
  templates: TemplateViewModel[],
};

function addTemplate(template: UnhydratedTemplate) {
  return dispatch => api.addTemplate(template)
    .then(savedTemplate => dispatch(addTemplateSuccess(savedTemplate)))
    .catch(err => dispatch(addTemplateFailure(err)));
}

function saveSkills(skills: UnhydratedTemplateSkill[]) {
  return dispatch => api.saveSkills(skills)
    .then(updateSkills => dispatch(saveSkillsSuccess({ updateSkills })))
    .catch(err => dispatch(saveSkillsFailure(err)));
}

function addSkillToTemplate(level: string, category: string, template: NormalizedTemplateViewModel, existingSkillId) {
  return dispatch => api.addSkill(template.id, level, category, existingSkillId)
    .then(res => dispatch(addSkillSuccess({ template: res.template, skills: res.skills })))
    .catch(err => dispatch(addSkillFailure(err)));
}

function replaceSkill(level: string, category: string, template: NormalizedTemplateViewModel, skill: UnhydratedTemplateSkill) {
  return dispatch => api.replaceSkill(template.id, level, category, skill)
    .then(res => dispatch(replaceSkillSuccess({ template: res.template, skills: res.skills })))
    .catch(err => dispatch(replaceSkillFailure(err)));
}

function removeSkill(level: string, category: string, template: NormalizedTemplateViewModel, skill: UnhydratedTemplateSkill) {
  return dispatch => api.removeSkill(template.id, level, category, skill.id)
    .then(res => dispatch(removeSkillSuccess({ template: res.template, skills: res.skills })))
    .catch(err => dispatch(removeSkillFailure(err)));
}

function retrieveTemplate(templateId: string) {
  return dispatch => Promise.all([api.getTemplate(templateId), api.getSkills()])
    .then(([template, skills]) => dispatch(retrieveTemplateSuccess({ template, skills })))
    .catch(err => dispatch(retrieveTemplateFailure(err)));
}

export const actions = {
  addTemplate,
  saveSkills,
  retrieveTemplate,
  addSkillToTemplate,
  replaceSkill,
  removeSkill,
};

const buildTemplateFetchSuccessResult = (state, template, skills?) => ({
  templateFetchResult: {
    success: true,
    error: null,
    template,
    skills: !!skills ? skills : state.templateFetchResult && state.templateFetchResult.skills,
  },
});

const handleAddTemplateSuccess = (state: MatricesState, action): MatricesState =>
  Object.assign({}, state, {
    templateAddResult: { success: true, error: null },
    templates: [].concat(state.templates, action.payload),
  });

const handleRetrieveTemplateSuccess = (state: MatricesState, action): MatricesState =>
  Object.assign({}, state, buildTemplateFetchSuccessResult(state, action.payload.template, action.payload.skills));

// TODO: split this into two actions
const handleSaveSkillSuccess = (state: MatricesState, action): MatricesState => {
  const skillResult = { skillResult: { success: true, error: null } };
  if (!state.templateFetchResult) {
    return Object.assign({}, state, skillResult);
  }
  const updatedSkills: UnhydratedTemplateSkill[] = action.payload.updateSkills;
  const skills = R.map((skill) => {
    const updatedSkill = R.find((s => s.id === skill.id), updatedSkills);
    if (updatedSkill) {
      return updatedSkill;
    }
    return skill;
  }, state.templateFetchResult.skills);
  const templateFetchResult = buildTemplateFetchSuccessResult(state, state.templateFetchResult.template, skills);
  return Object.assign({}, state, skillResult, templateFetchResult);
};

const handleUpdateTemplateSuccess = (state, action) => Object.assign({}, state, buildTemplateFetchSuccessResult(state, action.payload.template, action.payload.skills));

const handleFetchTemplateFailure = (state, action) => Object.assign({}, state, {
  templateFetchResult: {
    error: action.payload,
    success: false,
  },
});
export default handleActions({
  [addTemplateSuccess]: handleAddTemplateSuccess,
  [addTemplateFailure]: (state, action) => Object.assign({}, state, {
    templateAddResult: {
      error: action.payload,
      success: false,
    },
  }),
  [saveSkillsSuccess]: handleSaveSkillSuccess,
  [saveSkillsFailure]: (state, action) => Object.assign({}, state, {
    skillResult: {
      error: action.payload,
      success: false,
    },
  }),
  [addSkillSuccess]: handleUpdateTemplateSuccess,
  [addSkillFailure]: handleFetchTemplateFailure,
  [removeSkillSuccess]: handleUpdateTemplateSuccess,
  [removeSkillFailure]: handleFetchTemplateFailure,
  [replaceSkillSuccess]: handleUpdateTemplateSuccess,
  [replaceSkillFailure]: handleFetchTemplateFailure,
  [retrieveTemplateSuccess]: handleRetrieveTemplateSuccess,
  [retrieveTemplateFailure]: handleFetchTemplateFailure,
}, { });

export const getTemplateAddResult = state =>
  R.prop('templateAddResult', state) || {};
