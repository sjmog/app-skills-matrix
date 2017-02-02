import React from 'react';
import { Link } from 'react-router';
import './Home.scss';

export class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1 className="Home header">Hello World</h1>
        <ul role="nav">
          <li><Link to="/users">User Management</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}
