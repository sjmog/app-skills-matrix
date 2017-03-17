const template = ({ id, name, version, categories, levels, skillGroups }) => Object.freeze({
  id,
  get viewModel() {
    return { id, name };
  },
  get evaluationData() {
    return { id, name, version, categories, levels }
  },
  get userDetailsViewModel() {
    return { name };
  },
  createSkillGroups: function (skills) {
    return skillGroups.map((skillGroup, index) => ({
      id: index,
      category: skillGroup.category,
      level: skillGroup.level,
      skills: skillGroup.skills.map((skillId) =>
        Object.assign({}, skills[skillId].evaluationData, { status: { previous: null, current: null } }))
    }));
  }
});

module.exports = template;
module.exports.newTemplate = (id, name, skillGroups, levels, categories) =>
  ({
    id,
    name,
    skillGroups,
    levels,
    categories,
    createdDate: new Date()
  });
