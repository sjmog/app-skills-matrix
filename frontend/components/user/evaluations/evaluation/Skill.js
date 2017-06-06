import React, { PropTypes } from 'react';
import { Panel, Label, ButtonGroup, Button, Alert, Glyphicon } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../../modules/user/evaluations';

import SkillActions from '../../../common/SkillActions';
import SkillBody from './SkillBody';
import '../evaluation.scss'

const Skill = ({ level, skill, skillStatus, updateSkillStatus, prevSkill, nextSkill, isFirstSkill, isLastSkill }) => {
  const { name, skillId, criteria, questions } = skill;

  return (
    <div>
      <Panel
        key={skillId}
        header={
        <div className='skill-header'>
          <h4 className='skill-header__title'>{name}</h4>
          <Label className='skill-header__label' bsStyle='info'>{level}</Label>
        </div>
      }>
        <SkillBody criteria={criteria} questions={questions} />
        <SkillActions
          skillStatus={skillStatus}
          onAttained={() => updateSkillStatus(SKILL_STATUS.ATTAINED)}
          onNotAttained={() => updateSkillStatus(SKILL_STATUS.NOT_ATTAINED)}
          onFeedbackRequest={() => updateSkillStatus(SKILL_STATUS.FEEDBACK)}
          onSetObjective={() => updateSkillStatus(SKILL_STATUS.OBJECTIVE)}
        />
      </Panel>
      <ButtonGroup className='pull-right'>
        <Button
          disabled={isFirstSkill}
          onClick={() => prevSkill(skillId) }>
          <Glyphicon glyph='chevron-left'/>
          Previous skill
        </Button>
        <Button
          disabled={isLastSkill}
          onClick={() => nextSkill(skillId) }>
          Next skill
          <Glyphicon glyph='chevron-right'/>
        </Button>
      </ButtonGroup>
    </div>
  );
};

Skill.propTypes = {
  isLastSkill: PropTypes.bool.isRequired,
  isFirstSkill: PropTypes.bool.isRequired,
  level: PropTypes.string.isRequired,
  skill: PropTypes.shape({
    skillId: PropTypes.number.isRequired,
  }),
  updateSkillStatus: PropTypes.func.isRequired,
  nextSkill: PropTypes.func.isRequired,
  prevSkill: PropTypes.func.isRequired,
};

export default Skill;
