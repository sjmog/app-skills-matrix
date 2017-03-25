import React, { PropTypes } from 'react';
import { Modal, Button, Glyphicon, Alert } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../modules/user/evaluation';

const SkillDetailsModal = ({ showModal, onClose, skill, updateSkillStatus }) =>
  (
    <div>
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Skill Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { skill
            ? <div>
                <dl>
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
                </dl>
                <Button
                  bsStyle='primary'
                  bsSize='large'
                  onClick={() => updateSkillStatus(skill.id, skill.status.current)}>
                  {'Attained'}
                </Button>
                {
                  skill.status.current === SKILL_STATUS.ATTAINED
                    ? <Glyphicon className='skill-modal__attained-icon' glyph='ok-circle' />
                    : false
                }
                { skill.error ? <Alert bsStyle='danger'>Something went wrong: {skill.error.message}</Alert> : false }
              </div>
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
