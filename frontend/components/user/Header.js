import React, { Component } from 'react';
import { Navbar, Glyphicon } from 'react-bootstrap';

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
            <Navbar.Link
              pullRight
              href="/auth/github">LOGIN
            </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;
