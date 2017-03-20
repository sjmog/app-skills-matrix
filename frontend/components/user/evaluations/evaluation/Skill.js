import React, { PropTypes } from 'react';
import { ListGroupItem, ButtonGroup, Button, Alert } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../../modules/user/evaluation';
import AdditionalInfo from './AdditionalInfo';

const Skill = ({ evaluationId, skillGroupId, name, skillId, criteria, questions, updateSkillStatus, status = null, error }) =>
  (
    <ListGroupItem
      bsStyle={status && status.current === SKILL_STATUS.ATTAINED ? 'success' : null}
      key={skillId}>
      <h4 className='list-group-item-heading'>{name}</h4>
      <p><strong>Criteria: </strong>{criteria}</p>
      { questions ? <AdditionalInfo questions={questions}/> : false }
      <ButtonGroup className='skill__cta-group'>
        <Button
          active={status && status.current === SKILL_STATUS.ATTAINED}
          onClick={() => updateSkillStatus(evaluationId, skillGroupId, skillId, status.current)}>
          Attained
        </Button>
      </ButtonGroup>
      { error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false }
    </ListGroupItem>
  );

Skill.propTypes = {
  evaluationId: PropTypes.string.isRequired,
  skillGroupId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  skillId: PropTypes.number.isRequired,
  criteria: PropTypes.string.isRequired,
  questions: PropTypes.array,
  updateSkillStatus: PropTypes.func.isRequired,
  status: PropTypes.object,
};

export default Skill;
