const auth = require('../auth');

const user = ({ _id, name, email, mentor, template, createdDate, modifiedDate, templateId, mentorId, avatarUrl }) => Object.freeze({
  id: _id,
  templateId,
  get isAdmin() {
    return auth.isAdmin(email);
  },
  get manageUserViewModel() {
    return ({ id: _id, name, email, mentorId, templateId });
  },
  get signingData() {
    return ({ id: _id, email });
  },
  get evaluationData() {
    return ({ id: _id, name });
  },
  get userDetailsViewModel() {
    return ({
      name,
      avatarUrl,
      email,
      mentor: mentor && mentor.userDetailsViewModel,
      template: template && template.userDetailsViewModel,
    });
  },
  hasTemplate: Boolean(templateId),
  setMentor(mentorId) {
    if (mentorId === _id.toString()) {
      return { error: true, message: `User '${mentorId}' can not mentor themselves` };
    }

    return { mentorId, modifiedDate: new Date() };
  },
  setTemplate(templateId) {
    return { templateId, modifiedDate: new Date() };
  },
  toString() {
    return JSON.stringify(this);
  }
});

module.exports = user;
module.exports.newUser = (name, email, avatarUrl) => ({ name, email, createdDate: new Date(), avatarUrl });

