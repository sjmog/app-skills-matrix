import * as React from 'react';

import { SKILL_STATUS } from '../../../modules/user/evaluations';

const skillColour = (currentStatus, previousStatus) => {
  if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus !== SKILL_STATUS.ATTAINED) {
    return 'skill--newly-attained';
  } else if (currentStatus === SKILL_STATUS.ATTAINED) {
    return 'skill--attained';
  } else if (currentStatus === SKILL_STATUS.FEEDBACK) {
    return 'skill--feedback';
  } else if (currentStatus === SKILL_STATUS.OBJECTIVE) {
    return 'skill--objective';
  }

  return '';
};

type SkillProps = {
  skill: any, // TODO get type
  viewSkillDetails: (e:any) => void,
  isBeingEvaluated: boolean,
};

const Skill = ({ skill, viewSkillDetails, isBeingEvaluated }: SkillProps) => {
  const status = skill.status ? skillColour(skill.status.current, skill.status.previous) : '';
  const beginEvaluated = isBeingEvaluated ? 'skill--current' : false;

  return (
    <tr className={`${status} ${beginEvaluated}`} onClick={() => viewSkillDetails(skill)}>
      <td>{skill.name}</td>
    </tr>
  );
};


export default Skill;
