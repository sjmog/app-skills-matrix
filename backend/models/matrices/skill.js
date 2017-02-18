const skill = ({ _id: id }) => {
  return id
    ? Object.freeze({ id })
    : null;
};

module.exports = skill;
module.exports.newSkill = (skillId, name, acceptanceCriteria, questions) =>
  ({
    skillId,
    name,
    acceptanceCriteria,
    questions,
    createdDate: new Date()
  });