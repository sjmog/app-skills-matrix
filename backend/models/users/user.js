const auth = require('../auth');

module.exports = ({ _id, name, email }) => ({
  get isAdmin() {
    return auth.isAdmin(email);
  },
  get viewModel() {
    return ({ id: _id, name, email });
  },
  get signingData() {
    return ({ id: _id, email });
  },
  toString() {
    return JSON.stringify(this);
  }
});

