const template = ({ templateId, name }) => Object.freeze({
  get viewModel() {
    return { id: templateId, name };
  }
});

module.exports = template;
