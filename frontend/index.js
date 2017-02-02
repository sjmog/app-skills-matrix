import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import routes from './routes';

render(
  <Router routes={routes} history={hashHistory} />, document.getElementById('app')
);
