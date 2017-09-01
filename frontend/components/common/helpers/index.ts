import * as R from 'ramda';
import { SKILL_STATUS } from '../../../modules/user/evaluations';

const skillColour = (level: string, category: string, skillGroups: NormalizedSkillGroups) =>
  R.find((group: UnhydratedSkillGroup) => (group.level === level && group.category === category), R.values(skillGroups));
const skillColour = (currentStatus, previousStatus, prefix) => {
  if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus !== SKILL_STATUS.ATTAINED) {
    return `${prefix}--newly-attained`;
  } else if (currentStatus === SKILL_STATUS.ATTAINED) {
    return `${prefix}--attained`;
  } else if (currentStatus === SKILL_STATUS.FEEDBACK) {
    return `${prefix}--feedback`;
  } else if (currentStatus === SKILL_STATUS.OBJECTIVE) {
    return `${prefix}--objective`;
  }

  return `${prefix}--not-attained`;
};

const getSkillGroup = (level: string, category: string, skillGroups: SkillGroup[]) =>
  R.find(
    (skillGroup: SkillGroup) => (skillGroup.level === level && skillGroup.category === category),
    R.values(skillGroups),
  );

export {
  getSkillGroup,
  skillColour,
};
