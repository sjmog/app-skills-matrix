import React from 'react';

//  id, firstName, lastName, email

const dummyUsers = [
  { id: 0, firstName: 'David', lastName: 'Morgantini', email: '' },
  { id: 1, isDone: false, text: 'design actions' },
  { id: 2, isDone: false, text: 'implement reducer' },
  { id: 3, isDone: false, text: 'connect components' }
];

export class UserList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='users'>
        Users
      </div>
    );
  }
}
