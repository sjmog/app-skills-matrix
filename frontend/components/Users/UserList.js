import React from 'react';
import { connect } from 'react-redux';

import { addUser } from '../actions';

//  id, firstName, lastName, email

function UserItem(props) {
  const { user } = props;
  return (<li>
    <span>{user.firstName}</span>
    <span>{user.lastName}</span>
    <span>{user.email}</span>
  </li>);
}

class UserListComponent extends React.Component {
  constructor(props) {
    super(props);
    const { addUser, users } = props;
    this.addUser = addUser;
    this.users = users;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const firstName = this.refs.firstName.value;
    const lastName = this.refs.lastName.value;
    const email = this.refs.email.value;
    if (firstName.length !== 0 && lastName.length !== 0 && email.length !== 0) {
      this.refs.firstName.value = '';
      this.refs.lastName.value = '';
      this.refs.email.value = '';

      this.addUser(firstName, lastName, email);
    }
  };

  render() {
    return (
<<<<<<< HEAD:frontend/components/UserList.js
      <div className='users'>
        <input type='text' placeholder='First Name' ref='firstName'/>
        <input type='text' placeholder='Last Name' ref='lastName'/>
        <input type='text' placeholder='Email Address' ref='email'/>
        <button onClick={this.onSubmit}>New User</button>
        <ul>
          {this.users.map((user) => (<UserItem user={user} key={user.id}/>))}
        </ul>
      </div>
=======
      <h1 className="header">Users</h1>
>>>>>>> Restructure frontend and add navbar:frontend/components/Users/UserList.js
    );
  }
}

export const UserList = connect(
  function mapStateToProps(state) {
    console.log(state);
    return { users: state }
  },
  function mapDispatchToProps(dispatch) {
    return {
      addUser: (firstName, lastName, email) => dispatch(addUser(firstName, lastName, email)),
    };
  }
)(UserListComponent);
