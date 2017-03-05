import React, { PropTypes } from 'react';
import { Row, Col, Accordion, Panel, ListGroup, ProgressBar } from 'react-bootstrap';

import { statuses } from './helpers';

import Skill from './Skill';

const header = (level, skillsInGroup, skills) => {
  const totalNumberOfSkills = skillsInGroup.length;
  const numberOfAttainedSkills = skillsInGroup.filter((id) => skills[id].status === statuses.ATTAINED).length;
  const percentageAttained = numberOfAttainedSkills / totalNumberOfSkills * 100;

  return (
    <Row className='show-grid level-heading'>
      <Col md={6}>
        <h4>{level}</h4>
      </Col>
      <Col md={6}>
        <ProgressBar
          className='level-heading__progress-bar'
          bsStyle='success'
          now={percentageAttained}
        />
      </Col>
    </Row>
  );
};

const SkillGroup = ({ level, skillsInGroup, skills, eventKey, updateSkillStatus }) =>
  (
    <Accordion key={level} >
      <Panel
        header={header(level, skillsInGroup, skills)}
        eventKey={eventKey}
        bsStyle='primary'
      >
        <ListGroup fill >
          {
            skillsInGroup.map(
              (skillId) => {
                const { name, criteria, questions, status } = skills[skillId];

                return (
                  <Skill
                    key={level}
                    name={name}
                    skillId={skillId}
                    criteria={criteria}
                    questions={questions}
                    updateSkillStatus={updateSkillStatus}
                    status={status}
                  />
                );
              })
          }
        </ListGroup>
      </Panel>
    </Accordion>
  );

SkillGroup.propTypes = {
  level: PropTypes.string.isRequired,
  skillsInGroup: PropTypes.array.isRequired,
  skills: PropTypes.object.isRequired,
  eventKey: PropTypes.number.isRequired,
  updateSkillStatus: PropTypes.func.isRequired,
};

export default SkillGroup;
