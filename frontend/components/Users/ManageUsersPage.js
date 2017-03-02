import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../modules/manageUsers';
import { Row } from 'react-bootstrap';
import AddUserForm from './AddUserForm';
import UserList from './UserList';

class ManageUsersPageComponent extends React.Component {
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
    this.onUserSelectionChange = this.onUserSelectionChange.bind(this);
  }

  componentDidMount() {
    if (this.props.success) {
      this.clearUserForm();
    }
  }

  updateNewUserState(e) {
    const field = e.target.name;
    let newUser = this.state.newUser;
    newUser[field] = e.target.value;
    return this.setState({ newUser });
  }

  clearUserForm() {
    this.setState({ newUser: {} });
  }

  onAddUser(e) {
    e.preventDefault();
    this.props.actions.addUser(this.state.newUser);
  };

  onUserSelectionChange(e, user) {
    const checked = e.target.checked;
    let selectedUsers;
    if (checked) {
      selectedUsers = this.state.selectedUsers.concat([user.id]);
    } else {
      const index = this.state.selectedUsers.indexOf(user.id);
      selectedUsers = this.state.selectedUsers.splice(index, 1);
    }

    this.state.setState({ selectedUsers })
  }

  onSelectMentor(e, user) {
    e.preventDefault();
    this.props.actions.selectMentor(e.target.value, user);
  }

  onSelectTemplate(e, user) {
    e.preventDefault();
    this.props.actions.selectTemplate(e.target.value, user);
  }

  render() {
    return (
      <div>
        <Row>
          <h1 className="header">Users</h1>
        </Row>
        <AddUserForm
          newUser={this.state.newUser}
          updateNewUserState={this.updateNewUserState}
          onAddUser={this.onAddUser}
          error={this.props.error}
        />
        <UserList
          selectedUsers={this.state.selectedUsers}
          users={this.props.users}
          templates={this.props.templates}
          onSelectMentor={this.onSelectMentor}
          onSelectTemplate={this.onSelectTemplate}
          onUserSelectionChange={this.onUserSelectionChange}
        />
      </div>
    );
  }
}

ManageUsersPageComponent.propTypes = {
  users: PropTypes.array,
  templates: PropTypes.array,
};

export const ManageUsersPage = connect(
  function mapStateToProps(state) {
    return state.manageUsers;
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(ManageUsersPageComponent);
