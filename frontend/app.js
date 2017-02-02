import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import { UserList } from './components/UserList';
import { Home } from './components/Home/Home';

import reducer from './reducers';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Home}>
        <Route path="/users" component={UserList}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
