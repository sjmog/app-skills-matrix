import * as React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import UserApp from './components/user/App';
import AdminApp from './components/admin/App';
import AdminDashboard from './components/admin/Dashboard';
import { DashboardPage as UserDashboard } from './components/user/dashboard/Dashboard';
import { ManageUsersPage } from './components/admin/users/ManageUsersPage';
import { ManageMatricesPage } from './components/admin/matrices/ManageMatricesPage';
import { TemplatePage } from './components/admin/template/TemplatePage';
import { EvaluationPage } from './components/user/evaluations/EvaluationPage';
import { ActionPage } from './components/user/evaluations/ActionPage';

export const adminRoutes = (
  <Router history={browserHistory}>
    <Route path="/admin" component={AdminApp}>
      <IndexRoute component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={ManageUsersPage} />
      <Route path="/admin/matrices" component={ManageMatricesPage} />
      <Route path="/admin/matrices/templates/:templateId" component={TemplatePage} />
    </Route>
  </Router>
);

// TODO: May want to make action type a query param.
export const userRoutes = (
  <Router history={browserHistory}>
    <Route path="/" component={UserApp}>
      <IndexRoute component={UserDashboard} />
      <Route path="dashboard" component={UserDashboard} />
      <Route path="evaluations/:evaluationId" component={EvaluationPage} />
      <Route path="evaluations/:evaluationId/:actionType" component={ActionPage} />
    </Route>
  </Router>
);
