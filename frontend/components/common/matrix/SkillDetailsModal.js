import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

const SkillDetailsModal = ({ showModal, onClose, skill }) =>
  (
    <div>
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Skill Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { skill ?
            (<dl>
              <dt>name</dt>
              <dd>{skill.name}</dd>
              <dt>criteria</dt>
              <dd>{skill.criteria}</dd>
              <dt>type</dt>
              <dd>{skill.type}</dd>
              <dt>version</dt>
              <dd>{skill.version}</dd>
              <dt>questions</dt>
              <dd>
                <ul>
                  { skill.questions.map(({ title }) => <li key={title}>{title}</li>)}
                </ul>
              </dd>
            </dl>)
            : null
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

SkillDetailsModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  skill: PropTypes.object,
};

export default SkillDetailsModal;
