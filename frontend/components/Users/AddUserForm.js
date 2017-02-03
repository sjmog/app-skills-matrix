import React, { PropTypes } from 'react';
import { Row, Form, FormGroup, FormControl, Button, Glyphicon, Alert } from 'react-bootstrap';
import './users.scss'

const AddUserForm = ({ error, user, updateUserState, onSave }) =>
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
      <Row>
        { error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false }
      </Row>
    </div>
  );

AddUserForm.propTypes = {
  error: PropTypes.object,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string
  }),
  updateUserState: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AddUserForm;
