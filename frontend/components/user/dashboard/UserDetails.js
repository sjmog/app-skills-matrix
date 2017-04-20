import React from 'react';
import { Col } from 'react-bootstrap';
import './userDetails.scss';

const UserDetails = ({ user, mentor, template }) =>
  (
    <div>
      <Col xs={12} md={3}>
        <h2>My Details</h2>
        <img src={user.avatarUrl}/>
      </Col>
      <Col xs={12} md={9} className="user-details__col">
        <dl>
          <dt>name</dt>
          <dd>{user.name || 'n/a'}</dd>
          <dt>username</dt>
          <dd>{user.username}</dd>
          <dt>email</dt>
          <dd>{user.email || 'n/a'}</dd>
          <dt>mentor</dt>
          <dd>{mentor ? mentor.name || mentor.username : 'No Mentor Selected'}</dd>
          <dt>type</dt>
          <dd>{template ? template.name : 'No Type Selected'}</dd>
        </dl>
      </Col>
    </div>
  );

export default UserDetails;
