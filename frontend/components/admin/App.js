import React from 'react';
import { Grid } from 'react-bootstrap';

import Header from './Header';

const Full = ({ children }) =>
  (
    <div className="app">
      <Header />
      <div className="app-body">
        <main className="main">
          <div className="container-fluid">
            <Grid>
              {children}
            </Grid>
          </div>
        </main>
      </div>
    </div>
  );

export default Full;
