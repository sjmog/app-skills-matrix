export const USER_EXISTS = email => ({ message: `User with email '${email}' already exists` });
export const MUST_BE_ADMIN = () => ({ message: 'Must be an admin to perform action' });
export const USER_NOT_FOUND = () => ({ message: 'User not found' });
export const INVALID_USER_ID = (userId) => ({ message: `UserId '${userId}' is not valid` });
export const INVALID_EVALUATION_ID = (evaluationId) => ({ message: `EvaluationId '${evaluationId}' is not valid` });
export const TEMPLATE_NOT_FOUND = () => ({ message: 'Template not found' });
export const USER_HAS_NO_TEMPLATE = username => ({ message: `User '${username}' has not had a template selected` });
export const USER_HAS_NO_MENTOR = username => ({ message: `User '${username}' has not had a mentor selected` });
export const EVALUATION_NOT_FOUND = () => ({ message: 'Evaluation not found' });
export const SKILL_NOT_FOUND = () => ({ message: 'Skill not found' });
export const NOT_AUTHORIZED_TO_VIEW_EVALUATION = () => ({ message: 'Only the person being evaluated, their mentor and admin users can view an evaluation' });
export const NOT_AUTHORIZED_TO_ADD_NOTE = () => ({ message: 'Only the person being evaluated, their mentor and admin users can add notes' });
export const NOT_AUTHORIZED_TO_UPDATE_SKILL_STATUS = () => ({ message: 'You do not have permission to update the status of this skill' });
export const NOT_AUTHORIZED_TO_MARK_EVAL_AS_COMPLETE = () => ({ message: 'You do not have permission to mark this evaluation as complete' });
export const MUST_BE_LOGGED_IN = () => ({ message: 'You are not logged in' });
export const ONLY_USER_MENTOR_AND_LINE_MANAGER_CAN_SEE_ACTIONS = () => ({ message: 'You can\'t see actions for another user unless you are their mentor.' });
export const INVALID_LEVEL_OR_CATEGORY = (level, category, templateId) => ({ message: `Level '${level}' or Category '${category}' not found in tempate '${templateId}'` });
export const USER_NOT_ADMIN = () => ({ message: 'You must be an admin user to make this request' });
export const MUST_BE_NOTE_AUTHOR = () => ({ message: 'Only the author of a note can delete it' });
export const NOTE_NOT_FOUND = () => ({ message: 'Note not found' });
export const NOT_AUTHORIZED_TO_VIEW_TASKS = () => ({ message: `You can't see another user's tasks` });
export const UNKNOWN_ACTION = () => ({ message: 'Unknown action requested' });
export const INVALID_USER_UPDATE_REQUESTED = () => ({ message: 'Invalid update attempted. Name cannot be empty and email must be valid.' });
export const INVALID_TEMPLATE_UPDATE = () => ({ message: 'Please provide an ID, name, categories and levels.' });
export const DUPLICATE_TEMPLATE = () => ({ message: 'A matrix with this ID already exists. Please provide an alternative.' });
