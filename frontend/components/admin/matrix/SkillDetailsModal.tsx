import * as React from 'react';
import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormControl,
  Glyphicon,
  ControlLabel, Panel,
} from 'react-bootstrap';

type SkillDetailsModalProps = {
  showModal: boolean,
  onClose: () => void,
  skill?: UnhydratedTemplateSkill,
  onModifySkill: (skill: UnhydratedTemplateSkill) => void,
};

const FieldGroup = ({ id, label = '', ...props }) =>
  (<FormGroup controlId={id}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <FormControl name={id} {...props} />
  </FormGroup>);


class SkillDetailsModal extends React.Component<SkillDetailsModalProps, { skill: UnhydratedTemplateSkill }> {
  constructor(props) {
    super(props);
    this.state = { skill: this.props.skill };
    this.updateSkillState = this.updateSkillState.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ skill: nextProps.skill });
  }

  addQuestion() {
    const skill = this.state.skill;
    skill.questions.push({ title: '' });
    return this.setState({ skill });
  }

  updateQuestion(newValue, index) {
    const skill = this.state.skill;
    skill.questions[index] = { title: newValue };
    return this.setState({ skill });
  }

  updateSkillState(e) {
    const field = e.target.name;
    const skill = this.state.skill;
    skill[field] = e.target.value;
    return this.setState({ skill });
  }

  render() {
    const { showModal, onModifySkill, onClose } = this.props;
    const { skill } = this.state;

    if (!skill) {
      return false;
    }

    return (
      <div>
        <Modal show={showModal} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Skill Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={() => onModifySkill(this.state.skill)}>
              <FormGroup>
                <ControlLabel>id</ControlLabel>
                <FormControl.Static>{skill.id}</FormControl.Static>
              </FormGroup>
              <FormGroup>
                <ControlLabel>version</ControlLabel>
                <FormControl.Static>{skill.version}</FormControl.Static>
              </FormGroup>
              <FieldGroup
                id="name"
                type="text"
                label="Name"
                value={skill.name || ''}
                onChange={this.updateSkillState}
                placeholder="Name"
              />
              <FieldGroup
                id="criteria"
                type="text"
                label="Criteria"
                value={skill.criteria || ''}
                onChange={this.updateSkillState}
                placeholder="criteria"
              />
              <FormGroup controlId="type">
                <ControlLabel>Type</ControlLabel>
                <FormControl
                  componentClass="select"
                  placeholder="type"
                  onChange={this.updateSkillState}
                  defaultValue={skill.type}
                >
                  <option value="select" disabled>select</option>
                  <option value="behaviour">behaviour</option>
                  <option value="skill">skill</option>
                </FormControl>
              </FormGroup>

              <Panel header={<h3>Questions</h3>}>
                {skill.questions ?
                  skill.questions.map(({ title }, index) =>
                    <FieldGroup
                      id={`question_${index}`}
                      type="text"
                      value={title}
                      onChange={e => this.updateQuestion(e.target.value, index)}
                      placeholder="Question"
                    />) : false}
                <Button bsStyle="primary" onClick={this.addQuestion}>
                  <Glyphicon glyph="plus" /></Button>
              </Panel>

              <Button bsStyle="primary" type="submit">
                <Glyphicon glyph="plus" /> Update Question</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default SkillDetailsModal;
