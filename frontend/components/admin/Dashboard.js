import React from 'react';

export class Dashboard extends React.Component {
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
