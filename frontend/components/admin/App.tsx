import * as React from 'react';

import AdminHeader from './AdminHeader';

const Full = ({ children }) => (
  <div className="app">
    <AdminHeader/>
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
