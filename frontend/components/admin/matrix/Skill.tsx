import * as React from 'react';

import { SKILL_STATUS } from '../../../modules/user/evaluations';

type SkillProps = {
  skill: any, // TODO get type
  viewSkillDetails: (e:any) => void,
};

const Skill = ({ skill, viewSkillDetails }: SkillProps) => (
    <tr onClick={() => viewSkillDetails(skill)}>
      <td>{skill.name}</td>
    </tr>
  );

export default Skill;
