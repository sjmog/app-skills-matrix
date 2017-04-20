import React, { PropTypes } from 'react';
import { ButtonGroup, Button, Glyphicon} from 'react-bootstrap';

import { SKILL_STATUS } from '../../modules/user/evaluation';

import './skill-actions.scss';

const statusIcon = (currentStatus, previousStatus) => {
  if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus !== SKILL_STATUS.ATTAINED) {
    return <Glyphicon className='pull-right skill-status-icon skill-status-icon--newly-attained' glyph='ok-sign'/>;
  } else if (currentStatus === SKILL_STATUS.ATTAINED) {
    return <Glyphicon className='pull-right skill-status-icon skill-status-icon--attained' glyph='ok-sign'/>;
  } else if (currentStatus === SKILL_STATUS.FEEDBACK) {
    return <Glyphicon className='pull-right skill-status-icon skill-status-icon--feedback' glyph='question-sign'/>;
  } else if (currentStatus === SKILL_STATUS.OBJECTIVE) {
    return <Glyphicon className='pull-right skill-status-icon skill-status-icon--objective' glyph='exclamation-sign'/>;
  }

  return <Glyphicon className='pull-right skill-status-icon skill-status-icon--not-attained' glyph='remove-sign'/>;
};

const SkillActions = ({ skillStatus, onAttained, onNotAttained, onFeedbackRequest, onSetObjective }) => (
  <div className='skill-actions'>
    <ButtonGroup>
      <Button
        active={skillStatus.current === SKILL_STATUS.ATTAINED}
        bsStyle='default'
        bsSize='large'
        onClick={onAttained}>
        {'Attained'}
      </Button>
      <Button
        active={skillStatus.current === SKILL_STATUS.NOT_ATTAINED}
        bsStyle='default'
        bsSize='large'
        onClick={onNotAttained}>
        {'Not attained'}
      </Button>
      <Button
        active={skillStatus.current === SKILL_STATUS.FEEDBACK}
        bsStyle='default'
        bsSize='large'
        onClick={onFeedbackRequest}>
        {'Feedback'}
      </Button>
      <Button
        active={skillStatus.current === SKILL_STATUS.OBJECTIVE}
        bsStyle='default'
        bsSize='large'
        onClick={onSetObjective}>
        {'Objective'}
      </Button>
    </ButtonGroup>
    { statusIcon(skillStatus.current, skillStatus.previous) }
  </div>
);

SkillActions.propTypes = {
  skillStatus: PropTypes.shape({
    current: PropTypes.string,
    previous: PropTypes.string
  }).isRequired,
  onAttained: PropTypes.func.isRequired,
  onNotAttained: PropTypes.func.isRequired,
  onFeedbackRequest: PropTypes.func.isRequired,
  onSetObjective: PropTypes.func.isRequired,
};

export default SkillActions;