import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { UserList } from './components/UserList';
import { Home } from './components/Home';

const dummyUsers = [
  { id: 0, firstName: 'David', lastName: 'Morgantini', email: 'david@tes.com' },
  { id: 1, firstName: 'Charlie', lastName: 'Harris', email: 'charlie.harris@tesglobal.com' },
  { id: 2, firstName: 'Federico', lastName: 'Rampazzo', email: 'federico.rampazzo@tesglobal.com' },
];

render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <Route path="/users" users={dummyUsers} component={UserList}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
