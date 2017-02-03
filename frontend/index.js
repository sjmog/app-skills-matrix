import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import routes from './routes';
import { reducers as manageUsersReducers } from './modules/manageUsers';
import { reducers as manageImportReducers } from './modules/manageImport';

const reducers = combineReducers({ manageUsers: manageUsersReducers, manageImport: manageImportReducers });

const state = window.$REDUX_STATE;
const store = createStore(reducers, state, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory} />
  </Provider>,
  document.getElementById('app')
);
