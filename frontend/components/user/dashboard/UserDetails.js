import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './userDetails.scss';

const UserDetails = ({ user, mentor, template }) =>
  (
    <Col xs={12} md={12}>
      <h2>My Details</h2>
      <Row>
        <Col xs={12} md={2}>
          <Image src={user.avatarUrl} className="avatar" rounded />
        </Col>
        <Col xs={12} md={9} className="user-details__col">
          <dl>
            <dt>Name</dt>
            <dd>{user.name || 'n/a'}</dd>
            <dt>Username</dt>
            <dd>{user.username}</dd>
            <dt>Email</dt>
            <dd>{user.email || 'n/a'}</dd>
            <dt>Mentor</dt>
            <dd>{mentor ? mentor.name || mentor.username : 'No Mentor Selected'}</dd>
            <dt>Type</dt>
            <dd>{template ? template.name : 'No Type Selected'}</dd>
          </dl>
        </Col>
      </Row>
    </Col>
  );

export default UserDetails;
