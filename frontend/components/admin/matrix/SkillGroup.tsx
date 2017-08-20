import * as React from 'react';
import { Button, Table } from 'react-bootstrap';

import Skill from './Skill';

type SkillGroupProps = {
  skillGroup: SkillGroup,
  skills: UnhydratedTemplateSkill[],
  viewSkillDetails: (skill: UnhydratedTemplateSkill) => void,
  onAddSkill: (level: string, category: string) => void,
};

const SkillGroup = ({ skillGroup, skills, viewSkillDetails, onAddSkill }: SkillGroupProps) => (
  <td>
    <Table bordered>
      <tbody>
      {
        skillGroup.skills.map(
          (skillId) => {
            const skill = skills[skillId];

            return (
              <Skill
                key={skillId}
                skill={skill}
                viewSkillDetails={viewSkillDetails}
              />
            );
          })
      }
      </tbody>
    </Table>
    <Button bsStyle="primary" onClick={() => onAddSkill(skillGroup.level, skillGroup.category)}>
      New Skill</Button>
  </td>
);

export default SkillGroup;

