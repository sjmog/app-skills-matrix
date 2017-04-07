import React, { PropTypes } from 'react';
import { Panel, Label, ButtonGroup, Button, Alert, Glyphicon } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../../modules/user/evaluation';
import SkillBody from './SkillBody';
import '../evaluation.scss'

const Skill = ({ level, skill, updateSkillStatus, navigatePostSkillUpdate, prevSkill, nextSkill, isFirstSkill, isLastSkill }) => {
  const { name, id, criteria, questions } = skill;

  return (
    <div>
    <Panel
      key={id}
      header={
        <div className='skill-header'>
          <h4 className='skill-header__title'>{name}</h4>
          <Label className='skill-header__label' bsStyle='info'>{level}</Label>
        </div>
      }>
      <SkillBody criteria={criteria} questions={questions} />
      <ButtonGroup>
        <Button
          bsStyle='default'
          bsSize='large'
          onClick={
            () => updateSkillStatus(id, SKILL_STATUS.ATTAINED)
              .then(() => navigatePostSkillUpdate())}>
          {'Attained'}
        </Button>
        <Button
          bsStyle='default'
          bsSize='large'
          onClick={() => updateSkillStatus(id, null)
            .then(() => navigatePostSkillUpdate())}>
          {'Not attained'}
        </Button>
        {
          skill.status.current === SKILL_STATUS.ATTAINED
            ? <Glyphicon className='skill-attained-icon' glyph='ok-circle' />
            : false
        }
      </ButtonGroup>
    </Panel>
      <ButtonGroup className='pull-right' >
        <Button
          disabled={isFirstSkill}
          onClick={() => prevSkill(skill.id) }>
          <Glyphicon glyph='chevron-left'/>
          Previous skill
        </Button>
        <Button
          disabled={isLastSkill}
          onClick={() => nextSkill(skill.id) }>
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
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    criteria: PropTypes.string.isRequired,
    questions: PropTypes.array,
  }),
  updateSkillStatus: PropTypes.func.isRequired,
  navigatePostSkillUpdate: PropTypes.func.isRequired,
  nextSkill: PropTypes.func.isRequired,
  prevSkill: PropTypes.func.isRequired,
};

export default Skill;
