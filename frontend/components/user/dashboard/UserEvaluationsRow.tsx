import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import * as selectors from '../../../modules/user';

type UserEvaluationsRowProps = {
  userId: string,
  name: string,
  selectUser: (userId: string) => void,
  select: (userId: string) => void;
  isSelectedUser: boolean
};

const UserEvaluationsRow = ({ name, userId, select, isSelectedUser }: UserEvaluationsRowProps) => {
  return (
    <Button
      className="selector-list__btn"
      key={name}
      onClick={() => select(userId)}
      active={isSelectedUser}
      block
    >
      {name}
    </Button>
  );
};

export default connect(
  (state, { userId }) => {
    return ({
      name: selectors.getUserName(state, userId),
    });
  },
  (dispatch, props) => ({
    select: userId => dispatch(props.selectUser(userId)),
  }),
)(UserEvaluationsRow);
