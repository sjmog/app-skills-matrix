import * as React from 'react';
import { connect } from 'react-redux';

import Header from '../common/Header';
import * as selectors from '../../modules/user';

type UserHeaderProps = {
  username?: string,
};

const UserHeader = ({ username }: UserHeaderProps) => (
  <Header
    username={username}
    brandLink="/"
  />
);

export default connect(
  state => ({
    username: selectors.getLoggedInUsername(state),
  }), null, null, { pure: false }, /* Required for NavItem 'active' class: https://github.com/react-bootstrap/react-router-bootstrap/issues/152 */
)(UserHeader);
