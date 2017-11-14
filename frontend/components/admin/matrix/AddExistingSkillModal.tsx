import * as React from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Form } from 'react-bootstrap';

type AddExistingSkillModalProps = {
  showModal: boolean,
  closeModal: () => void,
  level: string,
  category: string,
  onAddSkill: (level: string, category: string, existingSkillId?: string) => void,
};

class AddExistingSkillModal extends React.Component<AddExistingSkillModalProps, { value: string }> {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { level, category, onAddSkill, closeModal } = this.props;
    const { value } = this.state;

    onAddSkill(level, category, value);
    this.setState({ value: '' });
    closeModal();
  }

  render() {
    const { showModal, closeModal, level, category } = this.props;

    return (
      <div>
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add an existing skill</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Please provide the ID of the skill you'd like to add to category <strong>{category}</strong> at the level
              of <strong>{level}</strong>. If it already exists in the matrix it will be moved to this new location.
            </p>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <FormControl
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder="Skill ID"
                />
              </FormGroup>
              <Button bsStyle="primary" type="submit">Add skill</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default AddExistingSkillModal;
