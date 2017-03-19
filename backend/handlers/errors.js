module.exports = Object.freeze({
  USER_EXISTS: (email) => ({ message: `User with email '${email}' already exists` }),
  MUST_BE_ADMIN: () => ({ message: 'Must be an admin to perform action' }),
  USER_NOT_FOUND: () => ({ message: 'User not found' }),
  TEMPLATE_NOT_FOUND: () => ({ message: 'Template not found' }),
  USER_HAS_NO_TEMPLATE: (username) => ({ message: `User '${username}' has not had a template selected` }),
  EVALUATION_NOT_FOUND: () => ({ message: 'Evaluation not found' }),
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR: () => ({ message: 'Only the person being evaluated and their mentor can view an evaluation' }),
  MUST_BE_LOGGED_IN: () => ({ message: 'You must be logged in to view this page' })
});
