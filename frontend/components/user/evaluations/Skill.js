import React, { PropTypes } from 'react';
import { ListGroupItem, ButtonGroup, Button } from 'react-bootstrap';

import { statuses } from './helpers';
import AdditionalInfo from './AdditionalInfo';

const Skill = ({ name, skillId, criteria, questions, updateSkillStatus, status = null }) =>
  (
    <ListGroupItem bsStyle={status === 'attained' ? 'success' : null} key={skillId}>
      <h4 className='list-group-item-heading'>{name}</h4>
      <p><strong>Criteria: </strong>{criteria}</p>
      { questions ? <AdditionalInfo questions={questions}/> : false }
      <ButtonGroup className='skill__cta-group'>
        <Button active={status === statuses.ATTAINED} onClick={() => updateSkillStatus(skillId, statuses.ATTAINED)}>
          Attained
        </Button>
        <Button active={status === statuses.UNATTAINED} onClick={() => updateSkillStatus(skillId, statuses.UNATTAINED)}>
          Not yet
        </Button>
      </ButtonGroup>
    </ListGroupItem>
  );


Skill.propTypes = {
  name: PropTypes.string.isRequired,
  skillId: PropTypes.number.isRequired,
  criteria: PropTypes.string.isRequired,
  questions: PropTypes.array,
  updateSkillStatus: PropTypes.func.isRequired,
  status: PropTypes.string
};

export default Skill;
