import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

class Header extends Component {
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Skills Matrix</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Link pullRight href="/auth/github">Login</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;
