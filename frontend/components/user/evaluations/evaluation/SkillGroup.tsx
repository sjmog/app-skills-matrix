import * as React from 'react';

import ProgressSkill from './ProgressSkill';

type SkillGroupProps = {
  skillGroup: any,
  viewSkillDetails: (skillUid: string) => void,
  category: string,
};

const SkillGroup = ({ skillGroup, viewSkillDetails, category }: SkillGroupProps) => (
  <td className="progress__skill-group">
    <div>
      {
        skillGroup.skills.map(
          skillUid => (
            <ProgressSkill
              key={skillUid}
              skillUid={skillUid}
              category={category}
            />
          ),
        )
      }
    </div>
  </td>
);

export default SkillGroup;

