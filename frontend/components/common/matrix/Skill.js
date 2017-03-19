import React, { PropTypes } from 'react';

import { SKILL_STATUS } from '../../../modules/user/evaluation';

const Skill = ({ status, name }) => (
  <tr className={ status && status.current === SKILL_STATUS.ATTAINED ? 'skill--attained' : false }>
    <td>{name}</td>
  </tr>
);

Skill.propTypes = {
  status: PropTypes.object,
  name: PropTypes.string.isRequired,
};

export default Skill;

