import * as React from 'react';

import UserHeader from './UserHeader';

const Full = ({ children }) => (
  <div className="app">
    <UserHeader />
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
