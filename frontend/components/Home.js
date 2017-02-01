import React from 'react';
import { Link } from 'react-router';

export function Home(props) {
  return (
    <div>
      <h1>Hello World</h1>
      <ul role="nav">
        <li><Link to="/users">User Management</Link></li>
        <li><Link to="/todos">Some other link</Link></li>
      </ul>

      {props.children}
    </div>
  );
}
