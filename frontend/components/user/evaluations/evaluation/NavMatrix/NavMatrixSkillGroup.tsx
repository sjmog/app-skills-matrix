import * as React from 'react';
import * as R from 'ramda';

import NavMatrixSkill from './NavMatrixSkill';

type NavMatrixSkillGroupProps = {
  skillGroup: UnhydratedSkillGroup,
  category: string,
};

const NavMatrixSkillGroup = ({ skillGroup, category }: NavMatrixSkillGroupProps) => {
  const skills = R.reverse(skillGroup.skills);

  return (
    <td className="nav_matrix__skill-group">
      <div>
        {
          skills.map(
            skillUid => (
              <NavMatrixSkill
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

export default NavMatrixSkillGroup;

