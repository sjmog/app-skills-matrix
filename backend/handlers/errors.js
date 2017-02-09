module.exports = Object.freeze({
  USER_EXISTS: (email) => ({ message: `User with email '${email}' already exists` }),
  MUST_BE_ADMIN: () => ({ message: 'Must be logged in and an admin to perform action' }),
  USER_NOT_FOUND: () => ({ message: 'User not found' }),
});
