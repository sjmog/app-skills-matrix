import R from 'ramda';

const getSkillGroup = (level, category, skillGroups) =>
  R.find(group => (group.level === level && group.category === category), R.values(skillGroups));

const statuses = {
  ATTAINED: 'attained',
  UNATTAINED: 'unattained',
};

export {
  getSkillGroup,
  statuses
}
