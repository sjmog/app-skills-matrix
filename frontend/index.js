import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import routes from './routes';
import reducer from './reducers';

const state = window.$REDUX_STATE;
const store = createStore(reducer, state, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory} />
  </Provider>,
  document.getElementById('app')
);
