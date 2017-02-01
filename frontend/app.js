import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { UserList } from './components/UserList';
import { Home } from './components/Home';

render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <Route path="/users" component={UserList}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
