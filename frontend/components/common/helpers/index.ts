import * as R from 'ramda';
import { SKILL_STATUS } from '../../../modules/user/evaluations';

const skillColour = (currentStatus: string, previousStatus: string, prefix: string): string => {

  if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus === SKILL_STATUS.NEW) {
    return `${prefix}--new`;
  } else if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus !== SKILL_STATUS.ATTAINED) {
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

const getSkillGroup = (level: string, category: string, skillGroups: NormalizedSkillGroups) =>
  R.find(
    (skillGroup: UnhydratedSkillGroup) => (skillGroup.level === level && skillGroup.category === category),
    R.values(skillGroups),
  );

export {
  getSkillGroup,
  skillColour,
};
