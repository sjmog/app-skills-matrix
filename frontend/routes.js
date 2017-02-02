import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Full from './components/Full';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserList } from './components/Users/UserList';

export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Dashboard}/>
      <Route path="dashboard" name="Dashboard" component={Dashboard}/>
      <Route path="users" component={UserList} />
    </Route>
  </Router>
);