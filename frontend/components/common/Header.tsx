import * as React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { gitHubAuth } from './constants';
import './header.scss';

type HeaderProps = {
  username?: string,
  brandLink: string,
  links?: { name: string, path: string }[],
};

const Header = ({ username, brandLink, links }: HeaderProps) => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href={brandLink}>
          <Glyphicon glyph="equalizer"/>
          {' SKILLS MATRIX'}
        </a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        {
          links && links.map(({ name, path }) => (
            <LinkContainer key={path} to={path} activeClassName="active">
              <NavItem>{name}</NavItem>
            </LinkContainer>
          ))
        }
      </Nav>
      <Nav pullRight>
        {
          username
            ? <Navbar.Text pullRight>{username}</Navbar.Text>
            : <div className="login-link__container"><a className="login-link" href={gitHubAuth}>Log In</a></div>
        }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;

