import * as React from 'react';

type SkillProps = {
  skill: UnhydratedTemplateSkill,
  viewSkillDetails: (e:any) => void,
};

const Skill = ({ skill, viewSkillDetails }: SkillProps) => (
    <tr onClick={() => viewSkillDetails(skill)}>
      <td>{skill.name}</td>
    </tr>
  );

export default Skill;
