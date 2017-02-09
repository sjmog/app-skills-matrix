import React from 'react';
import { Row, Table, FormGroup, FormControl } from 'react-bootstrap';
import './users.scss'

const selectMentor = (user, users, onSelectMentor) => {
  return (<FormGroup controlId="selectMentor">
    <FormControl componentClass="select" placeholder="choose mentor" value={user.mentorId || 'default'} onChange={(e) => onSelectMentor(e, user)}>
      <option disabled value='default'>Select...</option>
      { users.filter((u) => u.email !== user.email).map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
    </FormControl>
  </FormGroup>);
};

function userDetailsRow(user, users, onSelectMentor) {
  const { id, name, email } = user;
  return (
    <tr key={id}>
      <td>{id}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{selectMentor(user, users, onSelectMentor)}</td>
    </tr>
  );
}

const UserList = ({ users, onSelectMentor }) =>
  (
    <Row>
      <Table responsive bordered>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Select Mentor</th>
        </tr>
        </thead>
        <tbody>
        { users.map(user => userDetailsRow(user, users, onSelectMentor)) }
        </tbody>
      </Table>
    </Row>
  );

export default UserList;
