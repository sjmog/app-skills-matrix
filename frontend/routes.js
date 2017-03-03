import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import UserApp from './components/user/App';
import AdminApp from './components/admin/App';
import { Dashboard as AdminDashboard } from './components/admin/Dashboard';
import { Dashboard as UserDashboard } from './components/user/Dashboard';
import { ManageUsersPage } from './components/admin/users/ManageUsersPage';
import { ManageMatricesPage } from './components/admin/matrices/ManageMatricesPage';

export const adminRoutes = (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={AdminApp}>
      <IndexRoute component={AdminDashboard}/>
      <Route path="dashboard" name="Dashboard" component={AdminDashboard}/>
      <Route path="users" component={ManageUsersPage} />
      <Route path="matrices" component={ManageMatricesPage} />
    </Route>
  </Router>
);

export const userRoutes = (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={UserApp}>
      <IndexRoute component={UserDashboard}/>
      <Route path="dashboard" name="Dashboard" component={UserDashboard}/>
    </Route>
  </Router>
);
