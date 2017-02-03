import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Table } from 'react-bootstrap';
import * as Actions from '../../actions';
import './users.scss'

function userDetailsRow({ id, firstName, lastName, email }) {
  return (
    <tr key={id}>
      <td>{id}</td>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{email}</td>
    </tr>
  );
}

const UserList = ({ users  }) =>
  (
    <Row>
      <Table responsive bordered>
        <thead>
        <tr>
          <th>ID</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Email</th>
        </tr>
        </thead>
        <tbody>
        {users.map(user => userDetailsRow(user))}
        </tbody>
      </Table>
    </Row>
  );

export default UserList;