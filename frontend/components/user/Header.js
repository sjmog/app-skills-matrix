import React, { Component } from 'react';
import { Nav, Navbar, NavItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import './header.scss';

class Header extends Component {
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">
              <Glyphicon glyph='equalizer'/>
              {` SKILLS MATRIX`}
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/feedback">
                <NavItem eventKey={1}>Feedback</NavItem>
              </LinkContainer>
              <LinkContainer to="/objectives">
                <NavItem eventKey={2}>Objectives</NavItem>
              </LinkContainer>
            </Nav>
            <Navbar.Link
              pullRight
              href="/auth/github">Log In
            </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;
