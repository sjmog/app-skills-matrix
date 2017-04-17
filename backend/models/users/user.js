const R = require('ramda');
const auth = require('../auth');

const user = ({ _id, name, email, username, createdDate, modifiedDate, templateId, mentorId, avatarUrl }) => Object.freeze({
  id: _id.toString(),
  name,
  username,
  templateId,
  mentorId,
  get email() {
    return email;
  },
  get isAdmin() {
    return auth.isAdmin(email);
  },
  get manageUserViewModel() {
    return ({ id: _id.toString(), username, name, email, mentorId, templateId });
  },
  get feedbackData() {
    return ({ id: _id.toString(), name: name || username, mentorId });
  },
  get signingData() {
    return ({ id: _id.toString(), username });
  },
  get evaluationData() {
    return ({ id: _id.toString(), name: name || username, email });
  },
  get userDetailsViewModel() {
    return ({ id: _id.toString(), name, username, avatarUrl, email, mentorId, templateId });
  },
  hasTemplate: Boolean(templateId),
  hasMentor: Boolean(mentorId),
  setMentor(newMentorId) {
    if (newMentorId === _id.toString()) {
      return { error: true, message: `User '${newMentorId}' can not mentor themselves` };
    }

    return { mentorId: newMentorId, modifiedDate: new Date() };
  },
  setTemplate(templateId) {
    return { templateId, modifiedDate: new Date() };
  },
  toString() {
    return JSON.stringify(this);
  }
});

module.exports = user;
module.exports.newUser = (name, email, avatarUrl, username) => ({ username, name, email, createdDate: new Date(), avatarUrl });

