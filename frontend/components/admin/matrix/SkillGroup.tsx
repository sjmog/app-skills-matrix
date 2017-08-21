import * as React from 'react';
import { Button, Table } from 'react-bootstrap';
import * as R from 'ramda';

import Skill from './Skill';

type SkillGroupProps = {
  skillGroup: SkillGroup,
  skills: UnhydratedTemplateSkill[],
  viewSkillDetails: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
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
                viewSkillDetails={R.curry(viewSkillDetails)(skillGroup.level, skillGroup.category)}
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

