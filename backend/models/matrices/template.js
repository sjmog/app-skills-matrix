/* eslint-disable no-param-reassign */
export default ({ id, name, version, categories, levels, skillGroups }) => Object.freeze({
  id,
  skillGroups,
  get viewModel() {
    return { id, name };
  },
  get normalizedViewModel() {
    const skillGroupsWithId = skillGroups
      .map((skillGroup, index) => Object.assign({}, skillGroup, { id: index }));

    const indexedSkillGroups = skillGroupsWithId
      .reduce((collector, skillGroup) => {
        collector[skillGroup.id] = skillGroup;
        return collector;
      }, {});

    return { id, name, version, categories, levels, skillGroups: indexedSkillGroups };
  },
  get evaluationData() {
    return { id, name, version, categories, levels };
  },
  get userDetailsViewModel() {
    return { name };
  },
  createSkillGroups(allSkills) {
    let skills = [];
    const newSkillGroups = skillGroups.map((skillGroup, index) => {
      skills = skills.concat(skillGroup.skills.map(skillId =>
        Object.assign({}, allSkills[skillId].evaluationData, { status: { previous: null, current: null } })));
      return ({
        id: index,
        category: skillGroup.category,
        level: skillGroup.level,
        skills: skillGroup.skills,
      });
    });
    return { skills, skillGroups: newSkillGroups };
  },
});

export const newTemplate = (id, name, skillGroups, levels, categories) =>
  ({
    id,
    name,
    skillGroups,
    levels,
    categories,
    createdDate: new Date(),
  });
