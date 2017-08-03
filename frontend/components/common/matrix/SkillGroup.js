import React, { PropTypes } from 'react';

import Skill from './Skill';

const SkillGroup = ({ skillGroup, viewSkillDetails, skillBeingEvaluated }) => (
  <td>
    <div className="skillGroupContainer">
      {
        skillGroup.skills.map(
          skillUid => (
            <Skill
              key={skillUid}
              skillUid={skillUid}
              viewSkillDetails={viewSkillDetails}
              isBeingEvaluated={skillBeingEvaluated === skillId}
            />
          ),
        )
      }
    </div>
  </td>
);

SkillGroup.propTypes = {
  skillGroup: PropTypes.object.isRequired,
  skillBeingEvaluated: PropTypes.string,
};

export default SkillGroup;

