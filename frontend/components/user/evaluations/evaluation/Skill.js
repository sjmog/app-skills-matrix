import React, { PropTypes } from 'react';
import { Panel, Label, ButtonGroup, Button, Alert, Glyphicon } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../../modules/user/evaluation';
import SkillBody from './SkillBody';
import '../evaluation.scss'

const Skill = ({ level, skill, updateSkillStatus, prevSkill, nextSkill, isFirstSkill, isLastSkill }) => {
  const { name, id, criteria, questions, status, error } = skill;

  return (
    <div>
    <Panel key={id} header={<h4>{name}<Label className='pull-right' bsStyle='info'>{level}</Label></h4>}>
      <SkillBody criteria={criteria} questions={questions} />
      <Button
        bsStyle='primary'
        bsSize='large'
        onClick={() => updateSkillStatus(id, status.current)}>
        {'Attained'}
      </Button>
      {
        status.current === SKILL_STATUS.ATTAINED
          ? <Glyphicon className='skill-panel__attained-icon' glyph='ok-circle' />
          : false
      }
      <ButtonGroup className='pull-right' >
      <Button
        bsSize='large'
        disabled={isFirstSkill}
        onClick={() => prevSkill(skill.id) }>
        <Glyphicon glyph='chevron-left'/>
        Previous skill
      </Button>
      <Button
        bsSize='large'
        disabled={isLastSkill}
        onClick={() => nextSkill(skill.id) }>
        Next skill
        <Glyphicon glyph='chevron-right'/>
      </Button>
      </ButtonGroup>
      { error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false }
    </Panel>
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
    status: PropTypes.object.isRequired,
    error: PropTypes.object,
  }),
  updateSkillStatus: PropTypes.func.isRequired,
  nextSkill: PropTypes.func.isRequired,
  prevSkill: PropTypes.func.isRequired,
};

export default Skill;
