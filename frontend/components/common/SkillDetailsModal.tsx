import * as React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SKILL_STATUS } from '../../modules/user/skills';
import * as selectors from '../../modules/user/index';
import SkillActions from './SkillActions';
import Notes from '../user/notes/Notes';

type SkillDetailsModalProps = {
  evaluationId: string,
  skillUid: string,
  showModal: boolean,
  onClose: () => void,
  updateSkillStatus: (skillId: number, skillStatus: string, skillUid: string) => void,
  skill: UnhydratedEvaluationSkill,
  error: ErrorMessage,
  canUpdateSkillStatus: boolean,
};

const SkillDetailsModal = ({ evaluationId, skillUid, skill, error, showModal, onClose, updateSkillStatus, canUpdateSkillStatus }: SkillDetailsModalProps) => (
  <div>
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Skill Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { skill
          ? <div>
                <h4>Name</h4>
                <p>{skill.name}</p>
                <h4>Criteria</h4>
                <p>{skill.criteria ? skill.criteria : '-'}</p>
                <h4>Questions</h4>
                <div>
                  {skill.questions && skill.questions.length > 0
                    ? <ul>{skill.questions.map(({ title }) => <li key={title}>{title}</li>)}</ul>
                    : <p>-</p>
                  }
                </div>
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
            <Notes
              skillUid={skillUid}
              skillId={skill.id}
              evaluationId={evaluationId}
            />
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

export default connect((state, { skillUid }) => ({
  skill: selectors.getSkill(state, skillUid),
  error: selectors.getSkillError(state, skillUid),
}))(SkillDetailsModal);
