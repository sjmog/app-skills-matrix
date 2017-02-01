import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { TodoList } from './components/TodoList';
import { UserList } from './components/UserList';
import { Home } from './components/Home';

//  id, firstName, lastName, email

const dummyUsers = [
  { id: 0, firstName: 'David', lastName: 'Morgantini', email: '' },
  { id: 1, isDone: false, text: 'design actions' },
  { id: 2, isDone: false, text: 'implement reducer' },
  { id: 3, isDone: false, text: 'connect components' }
];

render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <Route path="/todos" component={TodoList}/>
      <Route path="/users" component={UserList}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
