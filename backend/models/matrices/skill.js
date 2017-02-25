const skill = ({ _id }) => {
  return _id
    ? Object.freeze({ id: _id })
    : null;
};

module.exports = skill;
module.exports.newSkill = (id, name, acceptanceCriteria, questions) =>
  ({
    id,
    name,
    acceptanceCriteria,
    questions,
    createdDate: new Date()
  });