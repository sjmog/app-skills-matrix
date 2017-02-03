import axios from 'axios';

const handleError = (error) => Promise.reject(error.response ? error.response.data : { message: error.message });
const getData = (response) => response.data;

export default ({
  saveUser: function ({ firstName, lastName, email }) {
    return axios.post('/skillz/users', { firstName, lastName, email })
      .then(getData)
      .catch(handleError);
  }
});
