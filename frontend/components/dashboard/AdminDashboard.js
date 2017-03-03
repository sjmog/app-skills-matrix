import React from 'react';

export class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1 className="header">Dashboard</h1>
        {this.props.children}
      </div>
    );
  }
}
