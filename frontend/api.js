import axios from 'axios';

const handleError = (error) => error.response ? error.response.data : { message: error.message };
const getData = (response) => response.data;

export default ({
  saveUserSuccess: function (firstName, lastName, email) {
    return axios.post('/skillz/users', { firstName, lastName, email }).then(getData, handleError);
  }
});
