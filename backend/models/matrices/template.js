const template = ({ id, name }) => Object.freeze({
  get viewModel() {
    return { id, name };
  }
});

module.exports = template;

module.exports.newTemplate = ({ templateId, name, skillGroups }) =>
  ({
    templateId,
    name,
    skillGroups,
    createdDate: new Date()
  });