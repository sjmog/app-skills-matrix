import * as React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Col, Panel } from 'react-bootstrap';

import EvaluationsList from './EvaluationsList';
import * as selectors from '../../../modules/user';

type UserEvaluationsProps = {
  userIds: string[],
  selectedUserEvaluations: string[],
  selector: () => string,
  selectUser: (userId: string) => void,
  select: (userId: string) => void,
  selectedUserId: null | string,
  users: UserDetailsViewModel[],
};

const UserEvaluations = ({ users, selectedUserEvaluations, select, selectedUserId }: UserEvaluationsProps) => (
  <div>
    <Col xs={3} md={3}>
      <ButtonGroup className="selector-list" vertical block>
        {
          users.map(({ id, name, username }, i) =>
            <Button
              className="selector-list__btn"
              key={name}
              onClick={() => select(id)}
              active={selectedUserId === id}
              block
            >
              {name || username}
            </Button>)
        }
      </ButtonGroup>
    </Col>
    <Col xs={9} md={9}>
      {!selectedUserId ? <Panel>No user selected</Panel> : false}
      {selectedUserId && selectedUserEvaluations.length === 0 ? <Panel>User has no evaluations</Panel> : false}
      {selectedUserId && selectedUserEvaluations.length > 0 ?
        <EvaluationsList evaluations={selectedUserEvaluations}/> : false}
    </Col>
  </div>
);

export default connect(
  (state, { selector, userIds }) => {
    const selectedUserId = selector(state);

    return ({
      selectedUserId,
      selectedUserEvaluations: selectors.getUserEvaluations(state, selectedUserId),
      users: selectors.getSortedUsers(state, userIds),
    });
  },
  (dispatch, { selectUser }) => ({
    select: (userId: string) => dispatch(selectUser(userId)),
  }),
)(UserEvaluations);
