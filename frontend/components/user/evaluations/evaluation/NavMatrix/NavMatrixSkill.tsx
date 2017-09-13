import * as React from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { skillColour } from '../../../../common/helpers/index';
import * as selectors from '../../../../../modules/user/index';
import { actions } from '../../../../../modules/user/evaluation';

type NavMatrixSkillProps = {
  skillUid: string,
  skill: UnhydratedEvaluationSkill,
  isBeingEvaluated: boolean,
  hasNotes: boolean,
  category: string,
  onSkillClick: (skillUid: string) => void,
};

const popover = (name, category, skillUid) => (<Popover title={category} id={skillUid}>{name}</Popover>);

const ProgressSkill = ({ skillUid, skill, category, isBeingEvaluated, onSkillClick }: NavMatrixSkillProps) => {
  const { name, status } = skill;
  const skillColourClass = skillColour(status.current, status.previous, 'nav_matrix__skill');
  const isBeingEvaluatedClass = isBeingEvaluated ? 'nav_matrix__skill--selected' : '';

  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="left"
      overlay={popover(name, category, skillUid)}
    >
      <div
        className={`${skillColourClass} nav_matrix__skill ${isBeingEvaluatedClass}`}
        onClick={() => onSkillClick(skillUid)}
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
    onSkillClick: (skillUid) => {
      dispatch(actions.setCurrentSkill(skillUid));
    },
  }),
)(ProgressSkill);
