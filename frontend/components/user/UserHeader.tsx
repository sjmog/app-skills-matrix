import * as React from 'react';
import { connect } from 'react-redux';

import Header from '../common/Header';
import * as selectors from '../../modules/user';

type UserHeaderProps = {
  username?: string,
  isAdmin: boolean,
};

const UserHeader = ({ username, isAdmin }: UserHeaderProps) => {
  const links = isAdmin ? [{ name: 'Admin tool', path: '/admin', standardLink: true }] : [];

  return (
    <Header
      username={username}
      brandLink="/"
      links={links}
    />
  );
};

export default connect(
  state => ({
    username: selectors.getLoggedInUsername(state),
    isAdmin: selectors.getLoggedInUserAdminStatus(state),
  }), null, null, { pure: false }, /* Required for NavItem 'active' class: https://github.com/react-bootstrap/react-router-bootstrap/issues/152 */
)(UserHeader);
