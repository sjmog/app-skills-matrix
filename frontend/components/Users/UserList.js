import React from 'react';
import R from 'ramda';
import { Row, Table, FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import './users.scss'

const selectMentor = (user, users, onSelectMentor) => {
  return (<FormGroup controlId="selectMentor">
    <FormControl componentClass="select" placeholder="choose mentor" value={user.mentorId || 'default'} onChange={(e) => onSelectMentor(e, user)}>
      <option disabled value='default'>Select...</option>
      { users.filter((u) => u.email !== user.email).map(user =>
        <option key={user.id} value={user.id}>{user.name}</option>)}
    </FormControl>
  </FormGroup>);
};

const selectTemplate = (user, templates, onSelectTemplate) => {
  return (<FormGroup controlId="selectMentor">
    <FormControl componentClass="select" placeholder="choose template" value={user.templateId || 'default'} onChange={(e) => onSelectTemplate(e, user)}>
      <option disabled value='default'>Select...</option>
      { templates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
    </FormControl>
  </FormGroup>);
};

function userDetailsRow(user, isSelected, onUserSelectionChange, makeSelectMentorComponent, makeSelectTemplateComponent) {
  const { id, name, email } = user;
  return (
    <tr key={id}>
      <td><Checkbox checked={isSelected} onChange={(e) => onUserSelectionChange(e, user)}/></td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{makeSelectMentorComponent(user)}</td>
      <td>{makeSelectTemplateComponent(user)}</td>
    </tr>
  );
}

const UserList = ({ users, templates, selectedUsers, onUserSelectionChange, onSelectMentor, onSelectTemplate }) => {
  const makeSelectTemplateComponent = R.curry(selectTemplate)(R.__, templates, onSelectTemplate);
  const makeSelectMentorComponent = R.curry(selectMentor)(R.__, users, onSelectMentor);

  return (
    <Row>
      <Table responsive bordered>
        <thead>
        <tr>
          <th>Select</th>
          <th>Name</th>
          <th>Email</th>
          <th>Select Mentor</th>
          <th>Select Template</th>
        </tr>
        </thead>
        <tbody>
        { users.map(user => userDetailsRow(user, R.contains(selectedUsers, user.id), onUserSelectionChange, makeSelectMentorComponent, makeSelectTemplateComponent)) }
        </tbody>
      </Table>
    </Row>
  );
};

export default UserList;
