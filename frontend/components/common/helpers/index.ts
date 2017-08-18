import * as R from 'ramda';

const getSkillGroup = (level: string, category: string, skillGroups: NormalizedSkillGroups) =>
  R.find((group: SkillGroup) => (group.level === level && group.category === category), R.values(skillGroups));

export {
  getSkillGroup,
};
