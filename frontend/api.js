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
  }
});
