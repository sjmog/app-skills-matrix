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
  saveTemplate(template): Promise<TemplateViewModel> {
    return axios.post('/skillz/matrices/templates', { action: 'save', template })
      .then(getData)
      .catch(handleError);
  },
  getTemplate(templateId): Promise<NormalizedTemplateViewModel> {
    return axios.get(`/skillz/matrices/templates/${templateId}`)
      .then(getData)
      .catch(handleError);
  },
  saveSkill(skill): Promise<TemplateSkillViewModel> {
    return axios.post('/skillz/matrices/skills', { action: 'save', skill })
      .then(getData)
      .catch(handleError);
  },
  getSkills(): Promise<UnhydratedTemplateSkill[]> {
    return axios.get('/skillz/matrices/skills')
      .then(getData)
      .catch(handleError);
  },
  retrieveEvaluation(evaluationId): Promise<EvaluationViewModel> {
    return axios.get(`/skillz/evaluations/${evaluationId}`)
      .then(getData)
      .catch(handleError);
  },
  subjectUpdateSkillStatus(evaluationId: string, skillGroupId: string, skillId: string, status): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'subjectUpdateSkillStatus', skillGroupId, skillId, status })
      .catch(handleError);
  },
  mentorUpdateSkillStatus(evaluationId, skillGroupId, skillId, status): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'mentorUpdateSkillStatus', skillGroupId, skillId, status })
      .catch(handleError);
  },
  adminUpdateSkillStatus(evaluationId, skillGroupId, skillId, status): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'adminUpdateSkillStatus', skillGroupId, skillId, status })
      .catch(handleError);
  },
  evaluationComplete(evaluationId): Promise<EvaluationMetadataViewModel> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'complete' })
      .then(getData)
      .catch(handleError);
  },
  retrieveAllActions(userId, actionType) {
    return axios.get(`/skillz/users/${userId}/actions?type=${actionType}`)
      .then(getData)
      .catch(handleError);
  },
});
