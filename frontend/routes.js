import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import UserApp from './components/user/App';
import AdminApp from './components/admin/App';
import { Dashboard as AdminDashboard } from './components/admin/Dashboard';
import { DashboardPage as UserDashboard } from './components/user/dashboard/Dashboard';
import { FeedbackPage } from './components/user/actions/FeedbackPage';
import { ObjectivesPage } from './components/user/actions/ObjectivesPage';
import { ManageUsersPage } from './components/admin/users/ManageUsersPage';
import { ManageMatricesPage } from './components/admin/matrices/ManageMatricesPage';
import { TemplatePage } from './components/admin/template/TemplatePage';
import { EvaluationPage } from './components/user/evaluations/EvaluationPage';
import { EvaluationCategoryPage } from './components/user/evaluations/evaluation/EvaluationCategoryPage';
import { EvaluationFeedbackPage } from './components/user/actions/EvaluationFeedbackPage';
import { EvaluationObjectivesPage } from './components/user/actions/EvaluationObjectivesPage';

export const adminRoutes = (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={AdminApp}>
      <IndexRoute component={AdminDashboard}/>
      <Route path="dashboard" name="Dashboard" component={AdminDashboard}/>
      <Route path="users" component={ManageUsersPage} />
      <Route path="matrices" component={ManageMatricesPage} />
      <Route path="matrices/templates/:templateId" component={TemplatePage} />
    </Route>
  </Router>
);

export const userRoutes = (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={UserApp}>
      <IndexRoute component={UserDashboard}/>
      <Route path="dashboard" name="Dashboard" component={UserDashboard}/>
      <Route path="feedback" name="Feedback" component={FeedbackPage}/>
      <Route path="objectives" name="Objectives" component={ObjectivesPage}/>
      <Route path="evaluations/:evaluationId" component={EvaluationPage} />
      <Route path="evaluations/:evaluationId/category/:category" component={EvaluationCategoryPage} />
      <Route path="evaluations/:evaluationId/feedback" component={EvaluationFeedbackPage} />
      <Route path="evaluations/:evaluationId/objectives" component={EvaluationObjectivesPage} />
    </Route>
  </Router>
);
