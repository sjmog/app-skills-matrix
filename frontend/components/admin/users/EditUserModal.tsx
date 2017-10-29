import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import * as selectors from '../../../modules/admin';
import { actions } from '../../../modules/admin/users';

type EditUserModalProps = {
  showModal: boolean
  onClose: () => void,
  userId: string,
  user?: {
    id: string,
    name?: string,
    username?: string,
    evaluations?: EvaluationMetadataViewModel[],
    email?: string,
  },
  update: (userId: string, updates: { name: string, email: string }) => void,
  error?: { message?: string },
};

class EditUserModal extends React.Component<EditUserModalProps, any> {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      submitting: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        name: nextProps.user.name || '',
        email: nextProps.user.email || '',
        submitting: false,
      });
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true });

    setTimeout(() => {
      this.setState({ submitting: false });
      this.props.update(this.props.user.id, this.state);
      this.props.onClose();
    }, 1500);
  }

  render() {
    const { showModal, onClose, user, error } = this.props;

    if (!user) {
      return (
        <div>
          <Modal show={showModal} onHide={onClose} bsSize="large">
            <Modal.Header closeButton>
              <Modal.Title>No user selected</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button onClick={onClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }

    return (
      <div>
        <Modal show={showModal} onHide={onClose} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>{user.name || user.username}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <div className="edit-details-form__container">
                <FormGroup>
                  <ControlLabel>Name</ControlLabel>
                  <FormControl
                    name="name"
                    type="text"
                    value={this.state.name}
                    placeholder="Enter name"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Email address</ControlLabel>
                  <FormControl
                    name="email"
                    type="text"
                    value={this.state.email}
                    placeholder="Enter email"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <Button
                  bsStyle="primary"
                  type="submit"
                  disabled={this.state.submitting}
                >
                  Update user details
                </Button>
              </div>
              {error ? <Alert bsStyle="danger">Something went wrong: {error.message || 'unknown issue'}</Alert> : false}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default connect(
  (state, { userId }) => ({
    user: selectors.getUser(state, userId),
    error: selectors.getUserManagementError(state),
  }),
  dispatch => ({
    update: (userId, updates) => dispatch(actions.updateUserDetails(userId, updates)),
  }),
)(EditUserModal);
