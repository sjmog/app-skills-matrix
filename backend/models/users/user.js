module.exports = ({ id, firstName, lastName, email }) => ({
  get viewModel() {
    return ({ id, firstName, lastName, email });
  }
});

