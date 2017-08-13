import * as React from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { SKILL_STATUS } from '../../../../modules/user/evaluations';
import * as selectors from '../../../../modules/user/index';
import { actions }  from '../../../../modules/user/evaluation';

const skillColour = (currentStatus, previousStatus) => {
  if (currentStatus === SKILL_STATUS.ATTAINED && previousStatus !== SKILL_STATUS.ATTAINED) {
    return 'progress_skill--newly-attained';
  } else if (currentStatus === SKILL_STATUS.ATTAINED) {
    return 'progress_skill--attained';
  } else if (currentStatus === SKILL_STATUS.FEEDBACK) {
    return 'progress_skill--feedback';
  } else if (currentStatus === SKILL_STATUS.OBJECTIVE) {
    return 'progress_skill--objective';
  }

  return 'progress_skill--not-attained';
};

type ProgressSkillProps = {
  skillUid: string,
  skill: any,
  isBeingEvaluated: boolean,
  viewSkillDetails: (skillUid: string) => void,
  hasNotes: boolean,
  category: string,
  onProgressSkillClick: (skillUid: string) => any,
};

const popover = (name, category, skillUid) => (<Popover title={category} id={skillUid} >{name}</Popover>);

const ProgressSkill = ({ skillUid, skill, category, isBeingEvaluated, onProgressSkillClick }: ProgressSkillProps) => {
  const { name, status } = skill;

  return (
    <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={popover(name, category, skillUid)}>
      <div
        className={`${skillColour(status.current, status.previous)} progress__skill ${isBeingEvaluated ? 'progress__skill--selected' : ''}`}
        onClick={() => onProgressSkillClick(skillUid)}
      />
    </OverlayTrigger>

  );
};

export default connect(
  (state, { skillUid }) => ({
    skill: selectors.getSkill(state, skillUid),
    isBeingEvaluated: selectors.getCurrentSkillUid(state) === skillUid,
  }),
  dispatch => ({
    onProgressSkillClick: (skillUid) => {
      dispatch(actions.setCurrentSkill(skillUid));
    },
  }),
)(ProgressSkill);
