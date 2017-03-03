import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './components/App';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { Dashboard } from './components/dashboard/Dashboard';
import { ManageUsersPage } from './components/admin/users/ManageUsersPage';
import { ManageMatricesPage } from './components/admin/matrices/ManageMatricesPage';

export const adminRoutes = (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={App}>
      <IndexRoute component={AdminDashboard}/>
      <Route path="dashboard" name="Dashboard" component={AdminDashboard}/>
      <Route path="users" component={ManageUsersPage} />
      <Route path="matrices" component={ManageMatricesPage} />
    </Route>
  </Router>
);

export const userRoutes = (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={App}>
      <IndexRoute component={Dashboard}/>
      <Route path="dashboard" name="Dashboard" component={Dashboard}/>
    </Route>
  </Router>
);
