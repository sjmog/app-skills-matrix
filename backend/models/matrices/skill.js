const skill = ({ _id, id, name }) => Object.freeze({
    id: _id,
    get viewModel() {
      return { id, name };
    }
  });

module.exports = skill;
module.exports.newSkill = (id, name, acceptanceCriteria, questions) =>
  ({
    id,
    name,
    acceptanceCriteria,
    questions,
    createdDate: new Date()
  });