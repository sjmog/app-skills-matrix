import React from 'react';

//  id, firstName, lastName, email

function UserItem(props) {
  return (<li>
    <span>{props.user.id}</span>
    <span>{props.user.firstName}</span>
    <span>{props.user.lastName}</span>
    <span>{props.user.email}</span>
  </li>);
}

export class UserList extends React.Component {
  render() {
    return (
      <div className='users'>
        <ul>
          {this.props.route.users.map((user) => (<UserItem user={user} key={user.id}/>))}
        </ul>
      </div>
    );
  }
}
