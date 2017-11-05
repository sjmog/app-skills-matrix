import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactTooltip from 'react-tooltip';

import * as selectors from '../../../modules/user/index';
import { SKILL_STATUS } from '../../../modules/user/skills';
import { skillColour }  from '../../common/helpers';

type SkillProps = {
  skillUid: string,
  skill: UnhydratedEvaluationSkill,
  viewSkillDetails: (skillUid: string) => void,
  isBeingEvaluated: boolean,
  hasNotes: boolean,
  skillsToDisplay: string[],
};

const skillState = (status) => {
  const currentStatus = !status ? 'NOT_ATTAINED' : status;

  switch (currentStatus) {
    case SKILL_STATUS.NOT_ATTAINED:
      return ['not-attained', 'not attained'];
    case SKILL_STATUS.ATTAINED:
      return ['attained', 'attained'];
    case SKILL_STATUS.FEEDBACK:
      return ['feedback', 'requires feedback'];
    case SKILL_STATUS.OBJECTIVE:
      return ['objective', 'current objective'];
    default:
      return ['not-attained', 'not attained'];
  }
};

const Skill = ({ skillUid, skill, viewSkillDetails, isBeingEvaluated, hasNotes, skillsToDisplay }: SkillProps) => {
  const statusClass = skill.status ? skillColour(skill.status.current, skill.status.previous, 'skill') : '';
  const beingEvaluatedClass = isBeingEvaluated ? 'skill--current' : false;

  const currentStateStatus = skillState(skill.status.current);
  const currentStateLabel = `The current state of this skill is: ${currentStateStatus[1]}`;
  const shouldDisplay = Boolean(skillsToDisplay.find(id => id === skillUid));

  return shouldDisplay ? (
    <div aria-hidden role="button" className={`skill--card ${statusClass} ${beingEvaluatedClass} previous--${skill.status.previous}`} onClick={() => viewSkillDetails(skillUid)}>
      {
        hasNotes
          ? <div className={'skill-card--notes'}>
              <span data-tip data-for={`skill-${skillUid}-notes`} className={`state--icon--notes`} />
              <ReactTooltip place="top" id={`skill-${skillUid}-notes`} type="dark" effect="solid">Skill has notes</ReactTooltip>
            </div>
          : false
      }
      {skill.name}
      <div className={'skill-card--state'}>
        <span data-tip data-for={`skill-${skillUid}-previous`} className={`state--icon--${skill.status.previous}`} />
        <ReactTooltip place="top" id={`skill-${skillUid}-previous`} type="dark" effect="solid">{`The previous state of this skill was: ${skill.status.previous ? skill.status.previous : 'not attained'}`}</ReactTooltip>

        <span data-tip data-for={`skill-${skillUid}-current`} className={`state--icon--${skill.status.current}`} />
        <ReactTooltip place="top" id={`skill-${skillUid}-current`} type="dark" effect="solid">{currentStateLabel}</ReactTooltip>
      </div>
    </div>
  ) : false;
};

export default connect((state, { skillUid, evaluationId }) => ({
    skill: selectors.getSkill(state, skillUid),
    isBeingEvaluated: selectors.getCurrentSkillUid(state) === skillUid,
    hasNotes: selectors.hasNotes(state, skillUid),
    skillsToDisplay: selectors.getSkillsToDisplay(state, evaluationId),
}))(Skill);
