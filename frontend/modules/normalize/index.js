const { normalize, schema } = require('normalizr');

const normaliseSkillGroup = (skillGroups) => {
  const skill = new schema.Entity('skills');
  const skillGroup = new schema.Entity('skillGroups', { skills: [skill] });
  const skillGroupList = new schema.Array(skillGroup);

  return normalize(skillGroups, skillGroupList).entities;
};

module.exports = (data) => {
  const { skills, skillGroups } = normaliseSkillGroup(data.skillGroups);

  return Object.assign({}, {
    template: data.template,
    skills,
    skillGroups
  });
};
