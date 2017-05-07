import React from 'react';
import R from 'ramda';
import { Row, Table, FormGroup, FormControl, Checkbox, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import UserEvaluationsModal from './UserEvaluationsModal';

import './users.scss'

const selectMentor = (user, users, onSelectMentor) => {
  return (
    <FormGroup controlId="selectMentor">
      <FormControl
        componentClass="select"
        placeholder="choose mentor"
        value={user.mentorId || 'default'}
        onChange={(e) => onSelectMentor(e, user)}
      >
        <option disabled value='default'>Select...</option>
        { users.filter((u) => u.email !== user.email).map(user =>
          <option key={user.id} value={user.id}>{user.name || user.username}</option>)}
      </FormControl>
    </FormGroup>
  );
};

const selectTemplate = (user, templates, onSelectTemplate) => {
  return (
    <FormGroup controlId="selectMentor">
      <FormControl
        componentClass="select"
        placeholder="choose template" value={user.templateId || 'default'}
        onChange={(e) => onSelectTemplate(e, user)}
      >
        <option disabled value='default'>Select...</option>
        { templates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
      </FormControl>
    </FormGroup>
  );
};

function userDetailsRow(user, isSelected, onUserSelectionChange, makeSelectMentorComponent, makeSelectTemplateComponent, viewSkillDetails) {
  const { id, name, email, username } = user;
  return (
    <tr key={id}>
      <td><Checkbox checked={Boolean(isSelected)} onChange={(e) => onUserSelectionChange(e, user)}/></td>
      <td>{username}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td>
        <Button onClick={() => viewSkillDetails(user)} >
          View evaluations
        </Button>
      </td>
      <td>{makeSelectMentorComponent(user)}</td>
      <td>{makeSelectTemplateComponent(user)}</td>
    </tr>
  );
}

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.hideSkillDetails = this.hideSkillDetails.bind(this);
  }

  viewSkillDetails(user) {
    this.setState({
      showModal: true,
      currentUser: user,
    });
  }

  hideSkillDetails() {
    this.setState({
      currentUser: null,
      showModal: false,
    })
  }

  render() {
    const { users, templates, selectedUsers, onUserSelectionChange, onSelectMentor, onSelectTemplate } = this.props;
    const makeSelectTemplateComponent = R.curry(selectTemplate)(R.__, templates, onSelectTemplate);
    const makeSelectMentorComponent = R.curry(selectMentor)(R.__, users, onSelectMentor);

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
          <th>Select Mentor</th>
          <th>Select Template</th>
        </tr>
        </thead>
        <tbody>
        { users.map(user => userDetailsRow(user, R.contains(user.id, selectedUsers), onUserSelectionChange, makeSelectMentorComponent, makeSelectTemplateComponent, this.viewSkillDetails)) }
        </tbody>
      </Table>
        <UserEvaluationsModal
          showModal={this.state.showModal}
          onClose={this.hideSkillDetails}
          user={this.state.currentUser || {}}
        />
      </div>
    );
  }
}


export default UserList;
