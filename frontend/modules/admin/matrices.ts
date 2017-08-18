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
  RETRIEVE_TEMPLATE_SUCCESS: null,
  RETRIEVE_TEMPLATE_FAILURE: null,
});

const addTemplateSuccess = createAction(constants.ADD_TEMPLATE_SUCCESS);
const addTemplateFailure = createAction(constants.ADD_TEMPLATE_FAILURE);
const saveSkillsSuccess = createAction(constants.SAVE_SKILLS_SUCCESS);
const saveSkillsFailure = createAction(constants.SAVE_SKILLS_FAILURE);
const addSkillSuccess = createAction(constants.ADD_SKILL_SUCCESS);
const addSkillFailure = createAction(constants.ADD_SKILL_FAILURE);
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

function addTemplate(template: string) {
  return dispatch => api.addTemplate(template)
    .then(savedTemplate => dispatch(addTemplateSuccess(savedTemplate)))
    .catch(err => dispatch(addTemplateFailure(err)));
}

function saveSkills(skills: UnhydratedTemplateSkill[]) {
  return dispatch => api.saveSkills(skills)
    .then(updateSkills => dispatch(saveSkillsSuccess({ updateSkills })))
    .catch(err => dispatch(saveSkillsFailure(err)));
}

function addSkillToTemplate(level: string, category: string, template: NormalizedTemplateViewModel) {
  return dispatch => api.addSkill(template.id, level, category)
    .then(res => dispatch(addSkillSuccess({ template: res.template, skills: res.skills })))
    .catch(err => dispatch(addSkillFailure(err)));
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
  const updatedSkills: UnhydratedTemplateSkill[] = action.payload.updatedSkills;
  const skills = state.templateFetchResult.skills.map((skill) => {
    const updatedSkill = R.find((s => s.id === skill.id), updatedSkills);
    if (updatedSkill) {
      return updatedSkill;
    }
    return skill;
  });
  const templateFetchResult = buildTemplateFetchSuccessResult(state, state.templateFetchResult.template, skills);
  return Object.assign({}, state, skillResult, templateFetchResult);
};

const handleAddSkillSuccess = (state, action) => Object.assign({}, state, buildTemplateFetchSuccessResult(state, action.payload.template, action.payload.skills));

export const reducers = handleActions({
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
  [addSkillSuccess]: handleAddSkillSuccess,
  [addSkillFailure]: (state, action) => Object.assign({}, state, {
    templateFetchResult: {
      error: action.payload,
      success: false,
    },
  }),
  [retrieveTemplateSuccess]: handleRetrieveTemplateSuccess,
  [retrieveTemplateFailure]: (state, action) => Object.assign({}, state, {
    templateFetchResult: {
      error: action.payload,
      success: false,
    },
  }),
}, { });

