import React, { PropTypes } from 'react';

import Skill from './Skill';

const SkillGroup = ({ skillGroup, skills, viewSkillDetails, skillBeingEvaluated }) => (
  <td>
    <div className="skillGroupContainer">
      {
        skillGroup.skills.map(
          (skillId) => {
            const skill = skills[skillId];
            return (
              <Skill
                key={skillId}
                skill={skill}
                viewSkillDetails={viewSkillDetails}
                isBeingEvaluated={skillBeingEvaluated === skillId}
              />
            );
          })
      }
    </div>
  </td>
);

SkillGroup.propTypes = {
  skillGroup: PropTypes.object.isRequired,
  skills: PropTypes.object.isRequired,
  skillBeingEvaluated: PropTypes.string,
};

export default SkillGroup;

