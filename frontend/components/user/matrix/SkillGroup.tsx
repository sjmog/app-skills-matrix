import * as React from 'react';
import * as R from 'ramda';

import Skill from './Skill';

type SkillGroupProps = {
  skillGroup: any,
  viewSkillDetails: (skillUid: string) => void,
};

const SkillGroup = ({ skillGroup, viewSkillDetails }: SkillGroupProps) => {
  const skills = R.reverse(skillGroup.skills);

  return (
    <td>
      <div className="skillGroupContainer">
        {
          skills.map(
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
}

export default SkillGroup;

