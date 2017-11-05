import * as React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { Table, FormControl, Button, Glyphicon } from 'react-bootstrap';

import * as selectors from '../../../modules/admin';
import UserEvaluationsModal from './UserEvaluationsModal';
import EditUserModal from './EditUserModal';

import './users.scss';

const selectMentor = (users, onSelectMentor, user) => (
  <FormControl
    componentClass="select"
    placeholder="choose mentor"
    value={user.mentorId || 'default'}
    onChange={e => onSelectMentor(e, user)}
  >
    <option disabled value="default">Select...</option>
    {users.filter(u => u.email !== user.email).map(user =>
      <option key={user.id} value={user.id}>{user.name || user.username}</option>)}
  </FormControl>
);

const selectLineManager = (users, onSelectLineManager, user) => (
  <FormControl
    componentClass="select"
    placeholder="choose line manager"
    value={user.lineManagerId || 'default'}
    onChange={e => onSelectLineManager(e, user)}
  >
    <option disabled value="default">Select...</option>
    {users.filter(u => u.email !== user.email).map(user =>
      <option key={user.id} value={user.id}>{user.name || user.username}</option>)}
  </FormControl>
);

const selectTemplate = (templates, onSelectTemplate, user) => (
  <FormControl
    componentClass="select"
    placeholder="choose template"
    value={user.templateId || 'default'}
    onChange={e => onSelectTemplate(e, user)}
  >
    <option disabled value="default">Select...</option>
    {templates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
  </FormControl>
);

function userDetailsRow(user, isSelected, onUserSelectionChange, makeSelectMentorComponent, makeSelectTemplateComponent, makeSelectLineManagerComponent, viewUserEvaluations, viewEditUserModal) {
  const { id, name, email, username } = user;
  return (
    <tr key={id}>
      <td className="users-list__cell">
        <input
          type="checkbox"
          checked={Boolean(isSelected)}
          onChange={e => onUserSelectionChange(e, user)} />
      </td>
      <td className="users-list__cell">
        <Glyphicon
          glyph="edit"
          className="edit-icon"
          onClick={() => viewEditUserModal(id)}
        />
      </td>
      <td className="users-list__cell">{name || '-'}</td>
      <td className="users-list__cell">{username}</td>
      <td className="users-list__cell">{email}</td>
      <td>
        <Button onClick={() => viewUserEvaluations(id)}>
          View evaluations
        </Button>
      </td>
      <td>{makeSelectMentorComponent(user)}</td>
      <td>{makeSelectTemplateComponent(user)}</td>
      <td>{makeSelectLineManagerComponent(user)}</td>
    </tr>
  );
}

type UserListProps = {
  users: UserWithEvaluations[],
  templates: TemplateViewModel[],
  selectedUsers: string[],
  onUserSelectionChange: (e: any, user: UserWithEvaluations) => void,
  onSelectMentor: (e: any, user: UserWithEvaluations) => void,
  onSelectLineManager: (e: any, user: UserWithEvaluations) => void,
  onSelectTemplate: (e: any, user: UserWithEvaluations) => void,
};

type UserListState = {
  showEvaluationsModal: boolean,
  showEditUserModal: boolean
  currentUser?: string,
};

class UserList extends React.Component<UserListProps, UserListState> {
  constructor(props) {
    super(props);
    this.state = {
      showEvaluationsModal: false,
      showEditUserModal: false,
    };

    this.viewUserEvaluations = this.viewUserEvaluations.bind(this);
    this.viewEditUserModal = this.viewEditUserModal.bind(this);
    this.hideUserEvaluations = this.hideUserEvaluations.bind(this);
    this.hideEditUserModal = this.hideEditUserModal.bind(this);
  }

  viewUserEvaluations(userId: string) {
    this.setState({
      showEvaluationsModal: true,
      currentUser: userId,
    });
  }

  viewEditUserModal(userId: string) {
    this.setState({
      showEditUserModal: true,
      currentUser: userId,
    });
  }

  hideUserEvaluations() {
    this.setState({
      currentUser: null,
      showEvaluationsModal: false,
    });
  }

  hideEditUserModal() {
    this.setState({
      currentUser: null,
      showEditUserModal: false,
    });
  }

  render() {
    const { users, templates, selectedUsers, onUserSelectionChange, onSelectMentor, onSelectLineManager, onSelectTemplate } = this.props;
    const makeSelectTemplateComponent = R.curry(selectTemplate)(templates, onSelectTemplate);
    const makeSelectMentorComponent = R.curry(selectMentor)(users, onSelectMentor);
    const makeSelectLineManagerComponent = R.curry(selectLineManager)(users, onSelectLineManager);

    return (
      <div>
        <Table responsive bordered>
          <thead>
          <tr>
            <th>Select</th>
            <th>Edit</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Evaluations</th>
            <th>Mentor</th>
            <th>Template</th>
            <th>Line Manager</th>
          </tr>
          </thead>
          <tbody>
          {users.map(user =>
            userDetailsRow(
              user,
              R.contains(user.id, selectedUsers),
              onUserSelectionChange,
              makeSelectMentorComponent,
              makeSelectTemplateComponent,
              makeSelectLineManagerComponent,
              this.viewUserEvaluations,
              this.viewEditUserModal))}
          </tbody>
        </Table>
        <EditUserModal
          showModal={this.state.showEditUserModal}
          onClose={this.hideEditUserModal}
          userId={this.state.currentUser || null}
        />
        <UserEvaluationsModal
          showModal={this.state.showEvaluationsModal}
          onClose={this.hideUserEvaluations}
          userId={this.state.currentUser || null}
        />
      </div>
    );
  }
}

export default connect(
  (state, { userId }) => ({
    users: selectors.getSortedUsers(state),
  }),
)(UserList);
