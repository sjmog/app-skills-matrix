import axios from 'axios';

const handleError = (error) => Promise.reject(error.response ? error.response.data : { message: error.message });
const getData = (response) => response.data;

export default ({
  saveUser: function ({ name, email }) {
    return axios.post('/skillz/users', { action: 'create', name, email })
      .then(getData)
      .catch(handleError);
  },
  selectMentor: function(mentorId, userId) {
    return axios.post(`/skillz/users/${userId}`, { action: 'selectMentor', mentorId })
      .then(getData)
      .catch(handleError);
  },
  selectTemplate: function(templateId, userId) {
    return axios.post(`/skillz/users/${userId}`, { action: 'selectTemplate', templateId })
      .then(getData)
      .catch(handleError);
  },
  startEvaluation: function(userId) {
    return axios.post(`/skillz/users/${userId}/evaluations`, { action: 'create' })
      .then(getData)
      .catch(handleError);
  },
  saveTemplate: function (template) {
    return axios.post('/skillz/matrices/templates', { action: 'save', template })
      .then(getData)
      .catch(handleError);
  },
  getTemplate: function (templateId) {
    return axios.get(`/skillz/matrices/templates/${templateId}`)
      .then(getData)
      .catch(handleError);
  },
  saveSkill: function (skill) {
    return axios.post('/skillz/matrices/skills', { action: 'save', skill })
      .then(getData)
      .catch(handleError);
  },
  getSkills: function () {
    return axios.get('/skillz/matrices/skills')
      .then(getData)
      .catch(handleError);
  },
  retrieveEvaluation: function (evaluationId) {
    return axios.get(`/skillz/evaluations/${evaluationId}`)
      .then(getData)
      .catch(handleError);
  },
  updateSkillStatus: function (evaluationId, skillGroupId, skillId, status) {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'updateSkillStatus', skillGroupId, skillId, status })
      .catch(handleError)
  },
  evaluationComplete: function (evaluationId) {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'complete' })
      .catch(handleError)
  }
});
