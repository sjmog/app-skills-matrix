const template = ({ id, name }) => Object.freeze({
  get viewModel() {
    return { id, name };
  }
});

module.exports = template;
