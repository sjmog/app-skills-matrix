import { handleActions } from 'redux-actions';

const init = [
  { id: 0, firstName: 'David', lastName: 'Morgantini', email: 'david@tes.com' },
  { id: 1, firstName: 'Charlie', lastName: 'Harris', email: 'charlie.harris@tesglobal.com' },
  { id: 2, firstName: 'Federico', lastName: 'Rampazzo', email: 'federico.rampazzo@tesglobal.com' },
];

export default handleActions({
  ADD_USER: (users = init, action) => { return users.push(action.payload) },
}, init);
