import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

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
          <Nav>
            <LinkContainer to="/users">
              <NavItem eventKey={1}>Users</NavItem>
            </LinkContainer>
            <LinkContainer to="/matrices">
              <NavItem eventKey={1}>Matrices</NavItem>
            </LinkContainer>
          </Nav>
          <Navbar.Link pullRight href="/auth/github">Login</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;
