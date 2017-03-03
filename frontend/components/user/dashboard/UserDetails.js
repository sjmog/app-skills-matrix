import React from 'react';
import { Col } from 'react-bootstrap';
import './userDetails.scss';

const UserDetails = ({ user }) => {
  return (<div>
      <Col xs={12} md={3}><img src={user.avatarUrl} /></Col>
      <Col xs={12} md={9}>
          <dl>
            <dt>name</dt>
            <dd>{user.name}</dd>
            <dt>email</dt>
            <dd>{user.email}</dd>
            <dt>mentor</dt>
            <dd>{user.mentor.name}</dd>
            <dt>type</dt>
            <dd>{user.template.name}</dd>
          </dl>
      </Col>
    </div>
  );
};

export default UserDetails;
