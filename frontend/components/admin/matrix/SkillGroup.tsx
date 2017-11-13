import * as React from 'react';
import { Table, DropdownButton, MenuItem, ButtonGroup, Button } from 'react-bootstrap';
import * as R from 'ramda';

import Skill from './Skill';
import './editable-matrix.scss';

type SkillGroupProps = {
  skillGroup: UnhydratedSkillGroup,
  skills: UnhydratedTemplateSkill[],
  viewSkillDetails: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  viewAddExistingSkill: (level: string, category: string) => void,
  onAddSkill: (level: string, category: string, existingSkillId?: string) => void,
};

// TODO: Convert this to be a stateless component.
class SkillGroup extends React.Component<SkillGroupProps> {
  render() {
    const { skillGroup, skills, viewSkillDetails, viewAddExistingSkill, onAddSkill } = this.props;
    return (
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
        <ButtonGroup block vertical className="add-skill-btn">
          <DropdownButton bsStyle="primary" title="Add skill" id="bg-vertical-dropdown-1">
            <MenuItem
              eventKey="1"
              onClick={() => onAddSkill(skillGroup.level, skillGroup.category, null)}>
              New skill
            </MenuItem>
            <MenuItem
              eventKey="2"
              onClick={() => viewAddExistingSkill(skillGroup.level, skillGroup.category)}
            >
            Existing skill</MenuItem>
          </DropdownButton>
        </ButtonGroup>
      </td>
    );
  }
}

export default SkillGroup;

