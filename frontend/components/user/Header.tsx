import * as React from 'react';
import { connect } from 'react-redux';
import { Nav, Navbar, NavItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import * as selectors from '../../modules/user';

import './header.scss';

type HeaderComponentProps = {
  username: string,
};

const HeaderComponent = ({ username }: HeaderComponentProps) => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">
          <Glyphicon glyph="equalizer" />
          {' SKILLS MATRIX'}
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
      <Nav pullRight>
        {
          username
            ? <Navbar.Text pullRight>{username}</Navbar.Text>
            : <Navbar.Link href="/auth/github">Log In</Navbar.Link>
        }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const Header = connect(
  state => ({
    username: selectors.getLoggedInUsername(state),
  }),
)(HeaderComponent);

export default Header;

