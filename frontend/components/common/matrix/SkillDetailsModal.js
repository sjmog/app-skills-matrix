import React, { PropTypes } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SKILL_STATUS } from '../../../modules/user/evaluations';
import * as selectors from '../../../modules/user';
import SkillActions from '../SkillActions';

const SkillDetailsModal = ({ skillUid, skill, error, showModal, onClose, updateSkillStatus, canUpdateSkillStatus }) => (
  <div>
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Skill Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { skill
          ? <div>
            <dl>
              <dt>id</dt>
              <dd>{skill.id}</dd>
              <dt>name</dt>
              <dd>{skill.name}</dd>
              <dt>criteria</dt>
              <dd>{skill.criteria ? skill.criteria : '-'}</dd>
              <dt>type</dt>
              <dd>{skill.type ? skill.type : '-'}</dd>
              <dt>version</dt>
              <dd>{skill.version ? skill.version : '-'}</dd>
              <dt>questions</dt>
              <dd>
                {skill.questions ? <ul>{skill.questions.map(({ title }) => <li key={title}>{title}</li>)}</ul> : '-'}
              </dd>
            </dl>
            {
              canUpdateSkillStatus
                ? <SkillActions
                  skillStatus={skill.status}
                  onAttained={() => updateSkillStatus(skill.id, SKILL_STATUS.ATTAINED, skillUid)}
                  onNotAttained={() => updateSkillStatus(skill.id, SKILL_STATUS.NOT_ATTAINED, skillUid)}
                  onFeedbackRequest={() => updateSkillStatus(skill.id, SKILL_STATUS.FEEDBACK, skillUid)}
                  onSetObjective={() => updateSkillStatus(skill.id, SKILL_STATUS.OBJECTIVE, skillUid)}
                />
                : false
            }
            { error ? <Alert bsStyle="danger">Something went wrong: {error}</Alert> : false }
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
  skillUid: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateSkillStatus: PropTypes.func,
  skill: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    criteria: PropTypes.string,
    type: PropTypes.string,
    version: PropTypes.number,
    questions: PropTypes.array,
  }).isRequired,
  error: PropTypes.string,
  canUpdateSkillStatus: PropTypes.bool,
};

export default connect((state, { skillUid }) => ({
  skill: selectors.getSkill(state, skillUid),
  error: selectors.getSkillError(state, skillUid),
}))(SkillDetailsModal);
