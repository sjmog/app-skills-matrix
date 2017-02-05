import axios from 'axios';

const handleError = (error) => Promise.reject(error.response ? error.response.data : { message: error.message });
const getData = (response) => response.data;

export default ({
  saveUser: function ({ name, email }) {
    return axios.post('/skillz/users', { name, email, action: 'create' })
      .then(getData)
      .catch(handleError);
  }
});
