import * as React from 'react';
import * as R from 'ramda';

import ProgressSkill from './ProgressSkill';

type SkillGroupProps = {
  skillGroup: any,
  category: string,
};

const SkillGroup = ({ skillGroup, category }: SkillGroupProps) => {
  const skills = R.reverse(skillGroup.skills);

  return (
    <td className="progress__skill-group">
      <div>
        {
          skills.map(
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
};

export default SkillGroup;

