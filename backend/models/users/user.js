module.exports = ({ _id, name, email }) => ({
  get viewModel() {
    return ({ id: _id, name, email });
  },
  get signingData() {
    return ({ id: _id, email });
  }
});

