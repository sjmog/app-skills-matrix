import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Panel, Row, Form, FormGroup, FormControl, Button, Glyphicon, Table} from 'react-bootstrap';
import * as Actions from '../../actions';
import './form.scss'

function userDetailsRow({ id, firstName, lastName, email }) {
 return (
   <tr key={email}>
     <td>{id}</td>
     <td>{firstName}</td>
     <td>{lastName}</td>
     <td>{email}</td>
   </tr>
 );
}

class UserListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };

    this.updateUserState = this.updateUserState.bind(this);
    this.onSave = this.onSave.bind(this);
    this.clearUserForm = this.clearUserForm.bind(this);
  }

  updateUserState(e) {
    const field = e.target.name;
    let user = this.state.user;
    user[field] = e.target.value;
    return this.setState({ user });
  }

  clearUserForm() {
    this.setState({ user: {} });
  }

  onSave(e) {
    e.preventDefault();
    this.props.actions.saveUser(this.state.user)
      .then(() => this.clearUserForm())
  };

  render() {
    return (
      <div>
        <Row className='show-grid'>
          <Form inline onSubmit={this.onSave}>
            <FormGroup>
              <FormControl
                type='text'
                placeholder='First name'
                name='firstName'
                onChange={this.updateUserState}
              />
            </FormGroup>
            {' '}
            <FormGroup>
              <FormControl
                type='text'
                placeholder='Last name'
                name='lastName'
                onChange={this.updateUserState}
              />
            </FormGroup>
            {' '}
            <FormGroup>
              <FormControl
                type='text'
                placeholder='Email address'
                name='email'
                onChange={this.updateUserState}
              />
            </FormGroup>
            {' '}
            <Button bsStyle='primary' type="submit">
              <Glyphicon glyph='plus' /> Add user</Button>
          </Form>
        </Row>
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
             {this.props.users.map(user => userDetailsRow(user))}
            </tbody>
          </Table>
        </Row>
      </div>
    );
  }
}

export const UserList = connect(
  function mapStateToProps(state) {
    return { users: state }
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    };
  }
)(UserListComponent);
