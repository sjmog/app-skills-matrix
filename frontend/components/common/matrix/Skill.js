import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { SKILL_STATUS } from '../../../modules/user/evaluations';
import * as selectors from '../../../modules/user';

const skillColour = (currentStatus, previousStatus) => {
  if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus !== SKILL_STATUS.ATTAINED) {
    return 'skill--newly-attained';
  } else if (currentStatus === SKILL_STATUS.ATTAINED) {
    return 'skill--attained';
  } else if (currentStatus === SKILL_STATUS.FEEDBACK) {
    return 'skill--feedback';
  } else if (currentStatus === SKILL_STATUS.OBJECTIVE) {
    return 'skill--objective';
  }

  return '';
};

const skillState = (status) => {
  const currentStatus = !status ? 'NOT_ATTAINED' : status;

  switch (currentStatus) {
    case 'NOT_ATTAINED':
      return ['not-attained', 'not attained'];
    case 'ATTAINED':
      return ['attained', 'attained'];
    case 'FEEDBACK':
      return ['feedback', 'requires feedback'];
    case 'OBJECTIVE':
      return ['objective', 'current objective'];
    default:
      return ['not-attained', 'not attained'];
  }
};

const Skill = ({ skillId, skill, viewSkillDetails, isBeingEvaluated }) => {
  const statusClass = skill.status ? skillColour(skill.status.current, skill.status.previous) : '';
  const beingEvaluatedClass = isBeingEvaluated ? 'skill--current' : false;

  const currentStateStatus = skillState(skill.status.current);
  const currentStateLabel = `The current state of this skill is: ${currentStateStatus}`;

  return (
    <div aria-hidden role="button" className={`skill--card ${statusClass} ${beingEvaluatedClass} previous--${skill.status.previous}`} onClick={() => viewSkillDetails(skillId)}>
      {skill.name}
      <div className={'skill-card--state'}>
        <span data-tip data-for={`skill-${skillId}-previous`} className={`state--icon--${skill.status.previous}`} />
        <ReactTooltip place="top" id={`skill-${skillId}-previous`} type="dark" effect="solid">{`The previous state of this skill was: ${skill.status.previous ? skill.status.previous : 'not attained'}`}</ReactTooltip>

        <span data-tip data-for={`skill-${skillId}-current`} className={`state--icon--${skill.status.current}`} />
        <ReactTooltip place="top" id={`skill-${skillId}-current`} type="dark" effect="solid">{currentStateLabel}</ReactTooltip>
      </div>
    </div>
  );
};

Skill.propTypes = {
  skillId: PropTypes.string.isRequired,
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.shape({
      previous: PropTypes.string,
      current: PropTypes.string,
    }).isRequired,
  }).isRequired,
  viewSkillDetails: PropTypes.func.isRequired,
};

export default connect((state, { skillId }) => ({
  skill: selectors.getSkill(state, skillId),
}))(Skill);
