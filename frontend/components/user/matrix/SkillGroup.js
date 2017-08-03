import React, { PropTypes } from 'react';

import Skill from './Skill';

const SkillGroup = ({ skillGroup, viewSkillDetails }) => (
  <td>
    <div className="skillGroupContainer">
      {
        skillGroup.skills.map(
          skillUid => (
            <Skill
              key={skillUid}
              skillUid={skillUid}
              viewSkillDetails={viewSkillDetails}
            />
          ),
        )
      }
    </div>
  </td>
);

SkillGroup.propTypes = {
  skillGroup: PropTypes.object.isRequired,
};

export default SkillGroup;

