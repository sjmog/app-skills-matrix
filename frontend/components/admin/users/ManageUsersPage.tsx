import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Button, Alert } from 'react-bootstrap';
import * as R from 'ramda';

import { actions } from '../../../modules/admin/users';
import AddUserForm from './AddUserForm';
import UserList from './UserList';
import * as selectors from '../../../modules/admin';

type ManageUsersPageComponentProps = {
  actions: typeof actions,
  success: boolean,
  error?: { message?: string },
  users: { users: UserDetailsViewModel[], newEvaluations: (EvaluationMetadataViewModel & { success: boolean, message: string })[] },
  matrices: { templates: TemplateViewModel[] },
};

type ManageUsersPageComponentState = {
  selectedUsers: string[],
  newUser: { name?: string, email?: string, username?: string },
};

class ManageUsersPageComponent extends React.Component<ManageUsersPageComponentProps, ManageUsersPageComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      newUser: {},
      selectedUsers: [],
    };

    this.updateNewUserState = this.updateNewUserState.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.clearUserForm = this.clearUserForm.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onSelectMentor = this.onSelectMentor.bind(this);
    this.onSelectTemplate = this.onSelectTemplate.bind(this);
    this.onSelectLineManager = this.onSelectLineManager.bind(this);
    this.onUserSelectionChange = this.onUserSelectionChange.bind(this);
    this.onStartEvaluation = this.onStartEvaluation.bind(this);
  }

  componentDidMount() {
    if (this.props.success) {
      this.clearUserForm();
    }
  }

  onAddUser(e) {
    e.preventDefault();
    this.props.actions.addUser(this.state.newUser);
  }

  onStartEvaluation(e) {
    e.preventDefault();
    this.state.selectedUsers.map(this.props.actions.startEvaluation);
    this.setState({ selectedUsers: [] });
  }

  onUserSelectionChange(e: any, user: UserDetailsViewModel) {
    const checked = e.target.checked;
    let selectedUsers;
    if (checked) {
      selectedUsers = this.state.selectedUsers.concat([user.id]);
    } else {
      selectedUsers = R.filter(id => id !== user.id, this.state.selectedUsers);
    }

    return this.setState({ selectedUsers });
  }

  onSelectMentor(e, user) {
    e.preventDefault();
    this.props.actions.selectMentor(e.target.value, user);
  }

  onSelectLineManager(e, user) {
    e.preventDefault();
    this.props.actions.selectLineManager(e.target.value, user);
  }

  onSelectTemplate(e, user) {
    e.preventDefault();
    this.props.actions.selectTemplate(e.target.value, user);
  }

  updateNewUserState(e) {
    const field = e.target.name;
    const newUser = this.state.newUser;
    newUser[field] = e.target.value;
    return this.setState({ newUser });
  }

  clearUserForm() {
    this.setState({ newUser: {} });
  }

  render() {
    const { error } = this.props;

    return (
      <Grid>
        <Row>
          <h1 className="header">Users</h1>
        </Row>
        <Row>
          <AddUserForm
            newUser={this.state.newUser}
            updateNewUserState={this.updateNewUserState}
            onAddUser={this.onAddUser}
          />
        </Row>
        <Row>
          <Button
            bsStyle="primary"
            disabled={this.state.selectedUsers.length === 0}
            onClick={this.onStartEvaluation}
          >
            Start evaluation
          </Button>
        </Row>
        <Row>
          {error ? <Alert bsStyle="danger">Something went wrong: {error.message || 'unknown issue'}</Alert> : false}
          <UserList
            selectedUsers={this.state.selectedUsers}
            users={this.props.users.users}
            templates={this.props.matrices.templates}
            onSelectMentor={this.onSelectMentor}
            onSelectTemplate={this.onSelectTemplate}
            onSelectLineManager={this.onSelectLineManager}
            onUserSelectionChange={this.onUserSelectionChange}
          />
        </Row>
        <Row>
          <ul>
            {
              this.props.users.newEvaluations.map(e => (
                <li key={e.id}>
                  {
                    e.success
                      ? <div>New evaluation created for {e.subject.name}</div>
                      : e.message
                  }
                </li>
              ))
            }
          </ul>
        </Row>
      </Grid>
    );
  }
}

export const ManageUsersPage = connect(
  state => ({
    users: state.users,
    matrices: state.matrices,
    error: selectors.getUserManagementError(state),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(ManageUsersPageComponent);
