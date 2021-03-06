import * as React from 'react';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import { SKILL_STATUS } from '../../modules/user/skills';

import './skill-actions.scss';

const statusIcon = (currentStatus, previousStatus) => {
  if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus !== SKILL_STATUS.ATTAINED) {
    return <Glyphicon className="skill-status-icon skill-status-icon--newly-attained" glyph="ok-sign" />;
  } else if (currentStatus === SKILL_STATUS.ATTAINED) {
    return <Glyphicon className="skill-status-icon skill-status-icon--attained" glyph="ok-sign" />;
  } else if (currentStatus === SKILL_STATUS.FEEDBACK) {
    return <Glyphicon className="skill-status-icon skill-status-icon--feedback" glyph="question-sign" />;
  } else if (currentStatus === SKILL_STATUS.OBJECTIVE) {
    return <Glyphicon className="skill-status-icon skill-status-icon--objective" glyph="screenshot" />;
  }

  return <Glyphicon className="skill-status-icon skill-status-icon--not-attained" glyph="remove-sign" />;
};

type SkillActionsProps = {
  skillStatus: {
    current: string,
    previous: string,
  },
  onAttained: () => void,
  onNotAttained: () => void,
  onFeedbackRequest: () => void,
  onSetObjective: () => void,
};

const SkillActions = ({ skillStatus, onAttained, onNotAttained, onFeedbackRequest, onSetObjective }: SkillActionsProps) => (
  <div className="skill-actions">
    <ButtonGroup>
      <Button
        active={skillStatus.current === SKILL_STATUS.ATTAINED}
        bsStyle="default"
        onClick={onAttained}
      >
        {'Attained'}
      </Button>
      <Button
        active={skillStatus.current === SKILL_STATUS.NOT_ATTAINED}
        bsStyle="default"
        onClick={onNotAttained}
      >
        {'Not attained'}
      </Button>
      <Button
        active={skillStatus.current === SKILL_STATUS.FEEDBACK}
        bsStyle="default"
        onClick={onFeedbackRequest}
      >
        {'Feedback'}
      </Button>
      <Button
        active={skillStatus.current === SKILL_STATUS.OBJECTIVE}
        bsStyle="default"
        onClick={onSetObjective}
      >
        {'Objective'}
      </Button>
    </ButtonGroup>
    { statusIcon(skillStatus.current, skillStatus.previous) }
  </div>
);

export default SkillActions;
