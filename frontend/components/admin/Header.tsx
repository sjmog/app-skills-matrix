import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/admin">Skills Matrix</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to="/admin/users">
          <NavItem eventKey={1}>Users</NavItem>
        </LinkContainer>
        <LinkContainer to="/admin/matrices">
          <NavItem eventKey={1}>Matrices</NavItem>
        </LinkContainer>
      </Nav>
      <Navbar.Link pullRight href="/auth/github">Log in</Navbar.Link>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
