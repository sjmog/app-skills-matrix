const template = ({ _id, id, name }) => Object.freeze({
  id: _id,
  get viewModel() {
    return { id, name };
  }
});

module.exports = template;
module.exports.newTemplate = (id, name, skillGroups) =>
  ({
    id,
    name,
    skillGroups,
    createdDate: new Date()
  });