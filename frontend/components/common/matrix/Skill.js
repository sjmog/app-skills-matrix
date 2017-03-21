import React, { PropTypes } from 'react';

import { SKILL_STATUS } from '../../../modules/user/evaluation';

const Skill = ({ skill, viewSkillDetails }) => (
  <tr className={ skill.status && skill.status.current === SKILL_STATUS.ATTAINED ? 'skill--attained' : false } onClick={() => viewSkillDetails(skill)}>
    <td>{skill.name}</td>
  </tr>
);

Skill.propTypes = {
  skill: PropTypes.object.isRequired,
  viewSkillDetails: PropTypes.func.isRequired,
};

export default Skill;
