import * as React from 'react';
import * as R from 'ramda';

import Skill from './Skill';

type SkillGroupProps = {
  skillGroup: UnhydratedSkillGroup,
  viewSkillDetails: (skillUid: string) => void,
  evaluationId: string,
};

const SkillGroup = ({ skillGroup, viewSkillDetails, evaluationId }: SkillGroupProps) => {
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
                evaluationId={evaluationId}
              />
            ),
          )
        }
      </div>
    </td>
  );
}

export default SkillGroup;

