import React from 'react';
import { render } from 'react-dom';
import { TodoList } from './components';

//  id, firstName, lastName, email

const dummyUsers = [
  { id: 0, firstName: 'David', lastName: 'Morgantini', email: '' },
  { id: 1, isDone: false, text: 'design actions' },
  { id: 2, isDone: false, text: 'implement reducer' },
  { id: 3, isDone: false, text: 'connect components' }
];

render(
<TodoList todos={dummyUsers} />,
  document.getElementById('app')
);
