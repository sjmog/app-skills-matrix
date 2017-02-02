import { createAction } from 'redux-actions';

// succinct hack for generating passable unique ids
const uid = () => Math.random().toString(34).slice(2);

export function addUserSuccess(user) {
  const userWithUid = Object.assign({}, { id: uid() }, user) ;
  return { type: 'ADD_USER', payload: userWithUid };
}

export function saveUser(user) {
  return function(dispatch) {
    return Promise.resolve(user )
      .then((user) => dispatch(addUserSuccess(user)))
      .catch((err) => {})
  }
}