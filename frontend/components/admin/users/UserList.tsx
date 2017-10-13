import * as React from 'react';
import * as R from 'ramda';
import { Table, FormGroup, FormControl, Checkbox, Button } from 'react-bootstrap';

import UserEvaluationsModal from './UserEvaluationsModal';

import './users.scss';

const selectMentor = (users, onSelectMentor, user) => (
  <FormGroup controlId="selectMentor">
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
  </FormGroup>
);

const selectLineManager = (users, onSelectLineManager, user) => (
  <FormGroup controlId="selectLineManager">
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
  </FormGroup>
);

const selectTemplate = (templates, onSelectTemplate, user) => (
  <FormGroup controlId="selectMentor">
    <FormControl
      componentClass="select"
      placeholder="choose template"
      value={user.templateId || 'default'}
      onChange={e => onSelectTemplate(e, user)}
    >
      <option disabled value="default">Select...</option>
      {templates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
    </FormControl>
  </FormGroup>
);

function userDetailsRow(user, isSelected, onUserSelectionChange, makeSelectMentorComponent, makeSelectTemplateComponent, makeSelectLineManagerComponent, viewUserEvaluations) {
  const { id, name, email, username } = user;
  return (
    <tr key={id}>
      <td><Checkbox checked={Boolean(isSelected)} onChange={e => onUserSelectionChange(e, user)} /></td>
      <td>{username}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td>
        <Button onClick={() => viewUserEvaluations(user)}>
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
  showModal: boolean,
  currentUser?: UserDetailsViewModel,
};

class UserList extends React.Component<UserListProps, UserListState> {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };

    this.viewUserEvaluations = this.viewUserEvaluations.bind(this);
    this.hideUserEvaluations = this.hideUserEvaluations.bind(this);
  }

  viewUserEvaluations(user) {
    this.setState({
      showModal: true,
      currentUser: user,
    });
  }

  hideUserEvaluations() {
    this.setState({
      currentUser: null,
      showModal: false,
    });
  }

  render() {
    const { users, templates, selectedUsers, onUserSelectionChange, onSelectMentor, onSelectLineManager, onSelectTemplate } = this.props;
    const makeSelectTemplateComponent = R.curry(selectTemplate)(templates, onSelectTemplate);
    const sortedUsers = R.sortBy<UserDetailsViewModel>(R.prop('name'), users);

    const makeSelectMentorComponent = R.curry(selectMentor)(sortedUsers, onSelectMentor);
    const makeSelectLineManagerComponent = R.curry(selectLineManager)(sortedUsers, onSelectLineManager);

    return (
      <div>
        <Table responsive bordered>
          <thead>
          <tr>
            <th>Select</th>
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
          {sortedUsers.map(user =>
            userDetailsRow(
              user,
              R.contains(user.id, selectedUsers),
              onUserSelectionChange,
              makeSelectMentorComponent,
              makeSelectTemplateComponent,
              makeSelectLineManagerComponent,
              this.viewUserEvaluations))}
          </tbody>
        </Table>
        <UserEvaluationsModal
          showModal={this.state.showModal}
          onClose={this.hideUserEvaluations}
          user={this.state.currentUser || {}}
        />
      </div>
    );
  }
}

export default UserList;
