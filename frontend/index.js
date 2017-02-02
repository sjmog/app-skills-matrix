import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import routes from './routes';
import reducer from './reducers';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory} />
  </Provider>,
  document.getElementById('app')
);
