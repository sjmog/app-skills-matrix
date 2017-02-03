module.exports = ({ _id, firstName, lastName, email }) => ({
  get viewModel() {
    return ({ id: _id, firstName, lastName, email });
  },
  get signingData() {
    return ({ id: _id, email });
  }
});

