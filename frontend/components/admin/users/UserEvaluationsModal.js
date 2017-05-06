import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

const UserEvaluationsModal = ({ showModal, onClose }) =>
  (
    <div>
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>User details modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Some links here</div>
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
};

export default UserEvaluationsModal;
