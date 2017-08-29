import * as React from 'react';

import Header from './Header';

const Full = ({ children }) =>
  (
    <div className="app">
      <Header />
      <div className="app-body">
        <main className="main">
          <div className="container-fluid">
              {children}
          </div>
        </main>
      </div>
    </div>
  );

export default Full;
