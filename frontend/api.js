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
  saveTemplate: function (template) {
    return axios.post('/skillz/templates', { action: 'create', template })
      .then(getData)
      .catch(handleError);
  },
  saveSkill: function (skill) {
    return axios.post('/skillz/skills', { action: 'create', skill })
      .then(getData)
      .catch(handleError);
  },
});
