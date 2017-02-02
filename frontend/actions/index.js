import { createAction } from 'redux-actions';

// succinct hack for generating passable unique ids
const uid = () => Math.random().toString(34).slice(2);

export const addUser = createAction('ADD_USER', (firstName, lastName, email) => ({
  id: uid(),
  firstName,
  lastName,
  email,
}));

