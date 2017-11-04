import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Alert } from 'react-bootstrap';

import UserEvaluationsList from './UserEvaluationsList';
import * as selectors from '../../../modules/admin';

type UserEvaluationsModalProps = {
  showModal: boolean
  onClose: (e: any) => void,
  userId: string,
  user?: {
    name?: string,
    username?: string,
    evaluations?: EvaluationMetadataViewModel[],
  },
  statusUpdateError: null | string,
};

const UserEvaluationsModal = ({ showModal, onClose, user, userId, statusUpdateError }: UserEvaluationsModalProps) => {
  if (!user) {
    return (
      <div>
        <Modal show={showModal} onHide={onClose} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>No user selected</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={onClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <Modal show={showModal} onHide={onClose} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>{user.name || user.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserEvaluationsList userId={userId} />
          { statusUpdateError ? <Alert bsStyle="danger">{`Something went wrong: ${statusUpdateError}`}</Alert> : false }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default connect(
  (state, { userId }) => ({
    user: selectors.getUser(state, userId),
    statusUpdateError: selectors.getStatusUpdateError(state),
  }),
)(UserEvaluationsModal);
