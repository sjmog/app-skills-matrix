import React, { PropTypes } from 'react';

import { SKILL_STATUS } from '../../../modules/user/evaluation';

const skillColour = (status) => {
  switch(status) {
    case SKILL_STATUS.ATTAINED:
      return 'skill--attained';
      break;
    case SKILL_STATUS.FEEDBACK:
      return 'skill--feedback';
      break;
    case SKILL_STATUS.OBJECTIVE:
      return 'skill--objective';
      break;
    default:
      return '';
  };
};

const Skill = ({ skill, viewSkillDetails, isBeingEvaluated }) => {
  const status = skillColour(skill.status.previous || skill.status.current);
  const beginEvaluated = isBeingEvaluated ? 'skill--current' : false;

  return (
    <tr className={`${status} ${beginEvaluated}`} onClick={() => viewSkillDetails(skill)}>
      <td>{skill.name}</td>
    </tr>
  )
};

Skill.propTypes = {
  skill: PropTypes.object.isRequired,
  viewSkillDetails: PropTypes.func.isRequired,
  isCurrentSkill: PropTypes.bool,
};

export default Skill;
