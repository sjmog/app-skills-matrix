import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

import UserEvaluationsList from './UserEvaluationsList';

const UserEvaluationsModal = ({ showModal, onClose, user }) => (
  <div>
    <Modal show={showModal} onHide={onClose} bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>{user.name || user.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { user.evaluations && user.evaluations.length
          ? <UserEvaluationsList evaluations={user.evaluations}/>
          : <div>This user has no evaluations</div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  </div>
);

UserEvaluationsModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.shape({
      name: PropTypes.string,
      username: PropTypes.string.isRequired,
      evaluations: PropTypes.array.isRequired,
    }),
  ])
};

export default UserEvaluationsModal;