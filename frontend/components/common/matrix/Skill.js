import React, { PropTypes } from 'react';

import { SKILL_STATUS } from '../../../modules/user/evaluation';

const Skill = ({ skill, viewSkillDetails, isCurrentSkill }) => {
  const backGroundColour = skill.status && skill.status.current === SKILL_STATUS.ATTAINED ? 'skill--attained' : false;
  const border = isCurrentSkill ? 'skill--current' : false;

  return (
    <tr className={`${backGroundColour} ${border}`} onClick={() => viewSkillDetails(skill)}>
      <td>{skill.name}</td>
    </tr>
  );
}

Skill.propTypes = {
  skill: PropTypes.object.isRequired,
  viewSkillDetails: PropTypes.func.isRequired,
  isCurrentSkill: PropTypes.bool.isRequired,
}
export default Skill;
