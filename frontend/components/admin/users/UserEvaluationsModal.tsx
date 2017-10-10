import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

import UserEvaluationsList from './UserEvaluationsList';

type UserEvaluationsModalProps = {
  showModal: boolean
  onClose: (e: any) => void,
  user: {
    name?: string,
    username?: string,
    evaluations?: EvaluationMetadataViewModel[],
  },
};

const UserEvaluationsModal = ({ showModal, onClose, user }: UserEvaluationsModalProps) => (
  <div>
    <Modal show={showModal} onHide={onClose} bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>{user.name || user.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { user.evaluations && user.evaluations.length
          ? <UserEvaluationsList evaluations={user.evaluations} />
          : <div>This user has no evaluations</div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  </div>
);

export default UserEvaluationsModal;
