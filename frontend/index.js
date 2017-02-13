import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import routes from './routes';
import { reducers as manageUsersReducers } from './modules/manageUsers';
import { reducers as manageMatricesReducers } from './modules/manageMatrices';

const reducers = combineReducers({ manageUsers: manageUsersReducers, manageMatrices: manageMatricesReducers });

const state = window.$REDUX_STATE;
const store = createStore(reducers, state, composeWithDevTools(applyMiddleware(thunk)));

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory} />
  </Provider>,
  document.getElementById('app')
);
