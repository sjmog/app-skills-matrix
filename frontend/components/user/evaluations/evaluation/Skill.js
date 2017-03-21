import React, { PropTypes } from 'react';
import { Panel, Col, ListGroupItem, ButtonGroup, Button, Alert, Glyphicon, Row } from 'react-bootstrap';


import { SKILL_STATUS } from '../../../../modules/user/evaluation';
import AdditionalInfo from './AdditionalInfo';
import '../evaluation.scss'

const Skill = ({ level, skill, updateSkillStatus, prevSkill, nextSkill, isFirstSkill, isLastSkill }) => {
  const { name, id, criteria, questions, status = null, error } = skill;

  return (
    <div>
    <Panel
      bsStyle={status && status.current === SKILL_STATUS.ATTAINED ? 'success' : 'primary' }
      key={id}
      header={<h2>{`${level}: ${name}`}</h2>}
    >
      <h4><strong>Criteria: </strong>{criteria}</h4>
      { questions ? <AdditionalInfo questions={questions}/> : false }
      <Button
        bsStyle='primary'
        bsSize='large'
        active={status && status.current === SKILL_STATUS.ATTAINED}
        onClick={() => updateSkillStatus(status.current)}>
        {'Attained'}
      </Button>
      <ButtonGroup
        className='pull-right'
      >
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
