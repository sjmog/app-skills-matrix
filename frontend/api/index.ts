import userApi from './user';
import adminApi from './admin';

export const handleError = (error): Promise<ErrorMessage> =>
  Promise.reject(error.response ? error.response.data : {
    error: true,
    message: error.message,
  });
export const getData = response => response.data;

export default ({
  ...userApi,
  ...adminApi,
});
