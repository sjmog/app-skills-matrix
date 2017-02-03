import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './components/App';
import { Dashboard } from './components/dashboard/Dashboard';
import { ManageUsersPage } from './components/users/ManageUsersPage';
import { ManageImportPage } from './components/import/ManageImportPage';

export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={App}>
      <IndexRoute component={Dashboard}/>
      <Route path="dashboard" name="Dashboard" component={Dashboard}/>
      <Route path="users" component={ManageUsersPage} />
      <Route path="import" component={ManageImportPage} />
    </Route>
  </Router>
);