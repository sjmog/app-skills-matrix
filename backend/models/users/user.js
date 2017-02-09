const auth = require('../auth');

const user = ({ _id, name, email, mentorId, createdDate, modifiedDate }) => Object.freeze({
  id: _id,
  get isAdmin() {
    return auth.isAdmin(email);
  },
  get viewModel() {
    return ({ id: _id, name, email, mentorId });
  },
  get signingData() {
    return ({ id: _id, email });
  },
  // returns changes required to this object based on this action
  setMentor(mentorId) {
    return { mentorId, modifiedDate: new Date() };
  },
  toString() {
    return JSON.stringify(this);
  }
});

module.exports = user;
module.exports.newUser = (name, email) => ({ name, email, createdDate: new Date() });

