import React from 'react';

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1 className="header">Dashboard</h1>
        <span>Winning!</span>
        {this.props.children}
      </div>
    );
  }
}
