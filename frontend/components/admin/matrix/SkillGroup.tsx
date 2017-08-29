import * as React from 'react';
import { Button, Form, FormControl, FormGroup, Table } from 'react-bootstrap';
import * as R from 'ramda';

import Skill from './Skill';

type SkillGroupProps = {
  skillGroup: UnhydratedSkillGroup,
  skills: UnhydratedTemplateSkill[],
  viewSkillDetails: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  onAddSkill: (level: string, category: string, existingSkillId: number) => void,
};

class SkillGroup extends React.Component<SkillGroupProps, { existingSkillId: number }> {
  constructor(props) {
    super(props);
    this.state = { existingSkillId: null };
    this.onExistingSkillIdChanged = this.onExistingSkillIdChanged.bind(this);
  }

  onExistingSkillIdChanged(e) {
    return this.setState({ existingSkillId: e.target.value });
  }

  render() {
    const { skillGroup, skills, viewSkillDetails, onAddSkill } = this.props;
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
        <Form inline>
          <Button bsStyle="primary" onClick={() => onAddSkill(skillGroup.level, skillGroup.category, this.state.existingSkillId)}>
            New Skill</Button>
          <FormGroup controlId="formInlineName">
            <FormControl
              id={`${skillGroup.level}${skillGroup.category}`}
              type="text"
              placeholder="Existing SkillId"
              onChange={this.onExistingSkillIdChanged}
              value={this.state.existingSkillId || ''} />
          </FormGroup>
        </Form>
      </td>
    );

  }
}


export default SkillGroup;

