import * as R from 'ramda';

const getSkillGroup = (level, category, skillGroups) =>
  R.find((group: { level: string, category: string }) => (group.level === level && group.category === category), R.values(skillGroups));

export {
  getSkillGroup,
};
