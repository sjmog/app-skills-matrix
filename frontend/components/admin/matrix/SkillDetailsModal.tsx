import * as React from 'react';
import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormControl,
  Glyphicon,
  ControlLabel, Panel, InputGroup,
} from 'react-bootstrap';

type SkillDetailsModalProps = {
  showModal: boolean,
  onClose: () => void,
  skill?: UnhydratedTemplateSkill,
  level?: string,
  category?: string,
  onModifySkill: (skill: UnhydratedTemplateSkill) => void,
  onReplaceSkill: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  onRemoveSkill: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
};

const FieldGroup = ({ id, label = '', ...props }) =>
  (<FormGroup>
    {label && <ControlLabel>{label}</ControlLabel>}
    <FormControl name={id} {...props} />
  </FormGroup>);


class SkillDetailsModal extends React.Component<SkillDetailsModalProps, { skill: UnhydratedTemplateSkill, level: string, category: string }> {
  constructor(props) {
    super(props);
    this.state = { skill: this.props.skill, level: this.props.level, category: this.props.category };
    this.updateSkillState = this.updateSkillState.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.updateSkill = this.updateSkill.bind(this);
    this.replaceSkill = this.replaceSkill.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ skill: nextProps.skill, level: nextProps.level, category: nextProps.category });
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

  removeQuestion(index) {
    const skill = this.state.skill;
    skill.questions.splice(index, 1);
    return this.setState({ skill });
  }

  updateSkillState(e) {
    const field = e.target.name;
    const skill = this.state.skill;
    skill[field] = e.target.value;
    return this.setState({ skill });
  }

  closeModel() {
    this.setState({ skill: null });
    this.props.onClose();
  }

  updateSkill() {
    this.props.onModifySkill(this.state.skill);
    this.closeModel();
  }

  replaceSkill() {
    this.props.onReplaceSkill(this.props.level, this.props.category, this.state.skill);
    this.closeModel();
  }

  removeSkill() {
    this.props.onRemoveSkill(this.props.level, this.props.category, this.state.skill);
    this.closeModel();
  }

  render() {
    const { showModal } = this.props;
    const { skill } = this.state;

    if (!skill) {
      return false;
    }

    return (
      <div>
        <Modal show={showModal} onHide={this.closeModel}>
          <Modal.Header closeButton>
            <Modal.Title>Skill Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
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
              <FormGroup>
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
                  skill.questions.map((q, index) =>
                    (<FormGroup key={`question_${index}`}>
                      <InputGroup>
                        <FormControl name={`question_${index}`}
                                     key={`question_${index}`}
                                     type="text"
                                     value={q.title}
                                     onChange={(e: any) => this.updateQuestion(e.target.value, index)}
                                     placeholder="Question"
                        />
                        <InputGroup.Button>
                          <Button onClick={() => this.removeQuestion(index)}>
                            <Glyphicon glyph="minus" />
                          </Button>
                        </InputGroup.Button>
                      </InputGroup>
                    </FormGroup>)) :
                  false}
                <Button bsStyle="primary" onClick={this.addQuestion}>
                  <Glyphicon glyph="plus" /></Button>
              </Panel>

              <Button bsStyle="primary" onClick={this.updateSkill}>
                Clarify Skill</Button>
              <Button bsStyle="primary" onClick={this.replaceSkill}>
                Replace Skill</Button>
              <Button bsStyle="danger" onClick={this.removeSkill}>
                Remove Skill</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModel}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default SkillDetailsModal;
