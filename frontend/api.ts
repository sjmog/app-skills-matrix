import axios from 'axios';

const handleError = (error): Promise<ErrorMessage> => Promise.reject(error.response ? error.response.data : { error: true, message: error.message });
const getData = response => response.data;

export default ({
  saveUser({ name, email, username }): Promise<UserDetailsViewModel> {
    return axios.post('/skillz/users', { action: 'create', name, email, username })
      .then(getData)
      .catch(handleError);
  },
  selectMentor(mentorId: string, userId: string): Promise<UserDetailsViewModel> {
    return axios.post(`/skillz/users/${userId}`, { action: 'selectMentor', mentorId })
      .then(getData)
      .catch(handleError);
  },
  selectTemplate(templateId: string, userId: string): Promise<UserDetailsViewModel> {
    return axios.post(`/skillz/users/${userId}`, { action: 'selectTemplate', templateId })
      .then(getData)
      .catch(handleError);
  },
  startEvaluation(userId: string): Promise<EvaluationViewModel> {
    return axios.post(`/skillz/users/${userId}/evaluations`, { action: 'create' })
      .then(getData)
      .catch(handleError);
  },
  addTemplate(template: UnhydratedTemplate): Promise<TemplateViewModel> {
    return axios.post('/skillz/matrices/templates', { action: 'save', template })
      .then(getData)
      .catch(handleError);
  },
  addSkill(templateId, level, category, existingSkillId): Promise<{ template: TemplateViewModel, skills: UnhydratedTemplateSkill[] }> {
    return axios.post(`/skillz/matrices/templates/${templateId}`, { action: 'addSkill', level, category, existingSkillId })
      .then(getData)
      .catch(handleError);
  },
  replaceSkill(templateId, level, category, skill): Promise<{ template: TemplateViewModel, skills: UnhydratedTemplateSkill[] }> {
    return axios.post(`/skillz/matrices/templates/${templateId}`, { action: 'replaceSkill', level, category, skill })
      .then(getData)
      .catch(handleError);
  },
  removeSkill(templateId, level, category, skillId): Promise<{ template: TemplateViewModel, skills: UnhydratedTemplateSkill[] }> {
    return axios.post(`/skillz/matrices/templates/${templateId}`, { action: 'removeSkill', level, category, skillId })
      .then(getData)
      .catch(handleError);
  },
  getTemplate(templateId: string): Promise<NormalizedTemplateViewModel> {
    return axios.get(`/skillz/matrices/templates/${templateId}`)
      .then(getData)
      .catch(handleError);
  },
  saveSkills(skills: UnhydratedTemplateSkill[]): Promise<UnhydratedTemplateSkill[]> {
    return axios.post('/skillz/matrices/skills', { action: 'save', skills })
      .then(getData)
      .catch(handleError);
  },
  getSkills(): Promise<UnhydratedTemplateSkill[]> {
    return axios.get('/skillz/matrices/skills')
      .then(getData)
      .catch(handleError);
  },
  retrieveEvaluation(evaluationId): Promise<any> { // TODO: Fix types - this will now include users & notes
    return axios.get(`/skillz/evaluations/${evaluationId}`)
      .then(getData)
      .catch(handleError);
  },
  subjectUpdateSkillStatus(evaluationId: string, skillId: string, status): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'subjectUpdateSkillStatus', skillId, status })
      .catch(handleError);
  },
  mentorUpdateSkillStatus(evaluationId, skillId, status): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'mentorUpdateSkillStatus', skillId, status })
      .catch(handleError);
  },
  adminUpdateSkillStatus(evaluationId, skillId, status): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'adminUpdateSkillStatus', skillId, status })
      .catch(handleError);
  },
  evaluationComplete(evaluationId): Promise<EvaluationMetadataViewModel> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'complete' })
      .then(getData)
      .catch(handleError);
  },
  addNote(evaluationId, skillId, note): Promise<NoteViewModel> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'addNote', skillId, note })
      .then(getData)
      .catch(handleError);
  },
  deleteNote(evaluationId, skillId, noteId): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'deleteNote', skillId, noteId })
      .then(getData)
      .catch(handleError);
  },
});
