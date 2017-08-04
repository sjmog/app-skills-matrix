import * as React from 'react';

import Skill from './Skill';

type SkillGroupProps = {
  skillGroup: any,
  viewSkillDetails: (skillUid: string) => void,
};

const SkillGroup = ({ skillGroup, viewSkillDetails }: SkillGroupProps) => (
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

export default SkillGroup;

