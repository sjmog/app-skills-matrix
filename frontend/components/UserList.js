import React from 'react';

//  id, firstName, lastName, email

function UserItem(props) {
  const { user } = props;
  return (<li>
    <span>{user.firstName}</span>
    <span>{user.lastName}</span>
    <span>{user.email}</span>
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
