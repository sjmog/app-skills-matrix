import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import { adminRoutes, userRoutes } from './routes';
import { reducers as adminReducers } from './modules/admin';
import { reducers as userReducers } from './modules/user';

const state = window.$REDUX_STATE;
const context = window.$CONTEXT;
const reducers = context === 'admin' ? adminReducers : userReducers;
const routes = context === 'admin' ? adminRoutes : userRoutes;

const store = createStore(reducers, state, composeWithDevTools(applyMiddleware(thunk)));

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory}/>
  </Provider>,
  document.getElementById('app')
);
