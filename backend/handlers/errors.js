module.exports = Object.freeze({
  USER_EXISTS: (email) => ({ message: `User with email '${email}' already exists` }),
  MUST_BE_ADMIN: () => ({ message: 'Must be an admin to perform action' }),
  USER_NOT_FOUND: () => ({ message: 'User not found' }),
  TEMPLATE_NOT_FOUND: () => ({ message: 'Template not found' }),
  USER_HAS_NO_TEMPLATE: (username) => ({ message: `User '${username}' has not had a template selected` }),
  USER_HAS_NO_MENTOR: (username) => ({ message: `User '${username}' has not had a mentor selected` }),
  EVALUATION_NOT_FOUND: () => ({ message: 'Evaluation not found' }),
  SKILL_NOT_FOUND: () => ({ message: 'Skill not found' }),
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR: () => ({ message: 'Only the person being evaluated and their mentor can view an evaluation' }),
  MUST_BE_LOGGED_IN: () => ({ message: 'You must be logged in to view this page' }),
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION: () => ({ message: "You can't make any changes to this evaluation." }),
  MENTOR_REVIEW_COMPLETE: () => ({ message: 'This evaluation has been reviewed and is now complete.'}),
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION: () => ({ message: "You can't update this evaluation until your mentee has completed their self-evaluation."})
});
