import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import { adminRoutes, userRoutes } from './routes';
import adminReducers from './modules/admin';
import userReducers from './modules/user';
import evaluation from './modules/user/middleware/evaluation';

const state = window.$REDUX_STATE;
const context = window.$CONTEXT;
const reducers = context === 'admin' ? adminReducers : userReducers;
const routes = context === 'admin' ? adminRoutes : userRoutes;

const store = createStore(
  reducers,
  state,
  composeWithDevTools(applyMiddleware(evaluation, thunk))
);

render(
  <Provider store={store}>
    { routes }
  </Provider>,
  document.getElementById('app')
);
