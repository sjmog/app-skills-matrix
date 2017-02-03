import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Panel, Row, Form, FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';
import * as Actions from '../../actions';
import './users.scss'

const AddUserForm = ({ user, updateUserState, onSave }) =>
  (
    <div>
      <Row className='show-grid'>
        <Form inline onSubmit={onSave}>
          <FormGroup>
            <FormControl
              type='text'
              placeholder='First name'
              name='firstName'
              value={user.firstName || ''}
              onChange={updateUserState}
            />
          </FormGroup>
          {' '}
          <FormGroup>
            <FormControl
              type='text'
              placeholder='Last name'
              name='lastName'
              value={user.lastName || ''}
              onChange={updateUserState}
            />
          </FormGroup>
          {' '}
          <FormGroup>
            <FormControl
              type='text'
              placeholder='Email address'
              name='email'
              value={user.email || ''}
              onChange={updateUserState}
            />
          </FormGroup>
          {' '}
          <Button bsStyle='primary' type="submit">
            <Glyphicon glyph='plus' /> Add user</Button>
        </Form>
      </Row>
    </div>
  );

AddUserForm.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string
  }),
  updateUserState: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AddUserForm;