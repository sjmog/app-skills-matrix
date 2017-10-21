import * as React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Col, Panel } from 'react-bootstrap';

import EvaluationsList from './EvaluationsList';
import UserEvaluationsRow from './UserEvaluationsRow';
import * as selectors from '../../../modules/user';

type UserEvaluationsProps = {
  userIds: string[],
  selectedUserEvaluations: string[],
  selector: () => string,
  selectUser: () => void,
  selectedUserId: null | string,
};

const UserEvaluations = ({ userIds, selectedUserEvaluations, selectUser, selectedUserId }: UserEvaluationsProps) => {
  return (
    <div>
    <Col xs={3} md={3}>
      <ButtonGroup className="selector-list" vertical block>
        {
          userIds.map((userId, i) =>
            <UserEvaluationsRow
              key={userId}
              selectUser={selectUser}
              userId={userId}
              isSelectedUser={selectedUserId === userId}
            />)
        }
      </ButtonGroup>
    </Col>
      <Col xs={9} md={9}>
        { !selectedUserId ? <Panel>No user selected</Panel> : false }
        {  selectedUserId && selectedUserEvaluations.length === 0 ?   <Panel>User has no evaluations</Panel> : false}
        {  selectedUserId && selectedUserEvaluations.length > 0 ? <EvaluationsList evaluations={selectedUserEvaluations} /> : false }
      </Col>
    </div>
  );
};

export default connect(
  (state, { selector }) => {
    const selectedUserId = selector(state);

    return ({
      selectedUserId,
      selectedUserEvaluations: selectors.getUserEvaluations(state, selectedUserId),
    });
  },
)(UserEvaluations);
