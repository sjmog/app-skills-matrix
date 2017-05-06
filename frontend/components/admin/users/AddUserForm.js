import React, { PropTypes } from 'react';
import { Row, Form, FormGroup, FormControl, Button, Glyphicon, Alert } from 'react-bootstrap';
import './users.scss'

const AddUserForm = ({ error, newUser, updateNewUserState, onAddUser }) =>
  (
    <div>
      <Form inline onSubmit={onAddUser}>
        <FormGroup>
          <FormControl
            type='text'
            placeholder='Name'
            name='name'
            value={newUser.name || ''}
            onChange={updateNewUserState}
          />
        </FormGroup>
        {' '}
        <FormGroup>
          <FormControl
            type='text'
            placeholder='Email address'
            name='email'
            value={newUser.email || ''}
            onChange={updateNewUserState}
          />
        </FormGroup>
        {' '}
        <FormGroup>
          <FormControl
            type='text'
            placeholder='Username'
            name='username'
            value={newUser.username || ''}
            onChange={updateNewUserState}
          />
        </FormGroup>
        {' '}
        <Button bsStyle='primary' type="submit">
          <Glyphicon glyph='plus'/> Add user</Button>
      </Form>
      { error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false }
    </div>
  );

AddUserForm.propTypes = {
  error: PropTypes.object,
  newUser: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string
  }),
  updateNewUserState: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired
};

export default AddUserForm;
