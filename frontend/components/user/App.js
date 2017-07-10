import React from 'react';

import Header from './Header';

const Full = () => (
  <div className="app">
    <Header />
    <div className="app-body">
      <main className="main">
        <div className="container-fluid">
          {this.props.children}
        </div>
      </main>
    </div>
  </div>
);

export default Full;
