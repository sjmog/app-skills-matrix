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
      newUser: {}
    };

    this.updateNewUserState = this.updateNewUserState.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.clearUserForm = this.clearUserForm.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
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
    this.props.actions.saveUser(this.state.newUser);
  };

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
          users={this.props.users}
        />
      </div>
    );
  }
}

ManageUsersPageComponent.propTypes = {
  users: PropTypes.array
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
