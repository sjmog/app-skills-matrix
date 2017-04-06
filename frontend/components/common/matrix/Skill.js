import React, { PropTypes } from 'react';

import { SKILL_STATUS } from '../../../modules/user/evaluation';

const Skill = ({ skill, viewSkillDetails, isBeingEvaluated, canViewDetails }) => {
  const attained = skill.status && skill.status.current === SKILL_STATUS.ATTAINED ? 'skill--attained' : false;
  const beginEvaluated = isBeingEvaluated ? 'skill--current' : false;

  if (canViewDetails) {
    return (
      <tr className={`${attained} ${beginEvaluated}`} onClick={() => viewSkillDetails(skill)}>
        <td>{skill.name}</td>
      </tr>
    )
  }

  return (
    <tr className={`${attained} ${beginEvaluated}`}>
      <td>{skill.name}</td>
    </tr>
  );
}

Skill.propTypes = {
  skill: PropTypes.object.isRequired,
  viewSkillDetails: PropTypes.func.isRequired,
  isCurrentSkill: PropTypes.bool,
  canViewDetails: PropTypes.bool
}
export default Skill;
