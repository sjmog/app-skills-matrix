import axios from 'axios';

const handleError = error => Promise.reject(error.response ? error.response.data : { message: error.message });
const getData = response => response.data;

export default ({
  saveUser({ name, email, username }) {
    return axios.post('/skillz/users', { action: 'create', name, email, username })
      .then(getData)
      .catch(handleError);
  },
  selectMentor(mentorId, userId) {
    return axios.post(`/skillz/users/${userId}`, { action: 'selectMentor', mentorId })
      .then(getData)
      .catch(handleError);
  },
  selectTemplate(templateId, userId) {
    return axios.post(`/skillz/users/${userId}`, { action: 'selectTemplate', templateId })
      .then(getData)
      .catch(handleError);
  },
  startEvaluation(userId) {
    return axios.post(`/skillz/users/${userId}/evaluations`, { action: 'create' })
      .then(getData)
      .catch(handleError);
  },
  saveTemplate(template) {
    return axios.post('/skillz/matrices/templates', { action: 'save', template })
      .then(getData)
      .catch(handleError);
  },
  getTemplate(templateId) {
    return axios.get(`/skillz/matrices/templates/${templateId}`)
      .then(getData)
      .catch(handleError);
  },
  saveSkill(skill) {
    return axios.post('/skillz/matrices/skills', { action: 'save', skill })
      .then(getData)
      .catch(handleError);
  },
  getSkills() {
    return axios.get('/skillz/matrices/skills')
      .then(getData)
      .catch(handleError);
  },
  retrieveEvaluation(evaluationId) {
    return axios.get(`/skillz/evaluations/${evaluationId}`)
      .then(getData)
      .catch(handleError);
  },
  subjectUpdateSkillStatus(evaluationId, skillId, status) {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'subjectUpdateSkillStatus', skillId, status })
      .catch(handleError);
  },
  mentorUpdateSkillStatus(evaluationId, skillId, status) {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'mentorUpdateSkillStatus', skillId, status })
      .catch(handleError);
  },
  adminUpdateSkillStatus(evaluationId, skillId, status) {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'adminUpdateSkillStatus', skillId, status })
      .catch(handleError);
  },
  evaluationComplete(evaluationId) {
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
