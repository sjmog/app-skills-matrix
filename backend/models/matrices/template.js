const template = ({ templateId, name }) => Object.freeze({
  get viewModel() {
    return { templateId, name };
  }
});

module.exports = template;
