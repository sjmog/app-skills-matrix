import * as React from 'react';
import { Form, FormGroup, FormControl, Button, Glyphicon, Alert } from 'react-bootstrap';
import './users.scss';

type AddUserFormProps = {
  error: { message: string },
  newUser: { name: string, email: string, username: string },
  updateNewUserState: (e: any) => void, // TODO: figure out type
  onAddUser: (e: any) => void, // TODO: figure out type
};

const AddUserForm = ({ error, newUser, updateNewUserState, onAddUser }: AddUserFormProps) =>
  (
    <div>
      <Form inline onSubmit={onAddUser}>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Name"
            name="name"
            value={newUser.name || ''}
            onChange={updateNewUserState}
          />
        </FormGroup>
        {' '}
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Email address"
            name="email"
            value={newUser.email || ''}
            onChange={updateNewUserState}
          />
        </FormGroup>
        {' '}
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Username"
            name="username"
            value={newUser.username || ''}
            onChange={updateNewUserState}
          />
        </FormGroup>
        {' '}
        <Button bsStyle="primary" type="submit">
          <Glyphicon glyph="plus" /> Add user</Button>
      </Form>
      {error ? <Alert bsStyle="danger">Something went wrong: {error.message}</Alert> : false}
    </div>
  );

export default AddUserForm;
