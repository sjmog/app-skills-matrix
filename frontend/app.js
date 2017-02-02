import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { createStore } from 'redux';

import { UserList } from './components/UserList';
import { Home } from './components/Home';
import reducer from './reducers';

const store = createStore(reducer);

console.log(store.getState());

render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <Route path="/users" users={store.getState()} component={UserList}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
