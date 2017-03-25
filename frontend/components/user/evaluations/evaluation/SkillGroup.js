import React, { PropTypes } from 'react';
import { Row, Col, Accordion, Panel, ListGroup, ProgressBar } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../../modules/user/evaluation';

import Skill from './Skill';

const header = (level, skillsInGroup, skills) => {
  const totalNumberOfSkills = skillsInGroup.length;
  const numberOfAttainedSkills = skillsInGroup.filter(
    (id) => skills[id].status.current === SKILL_STATUS.ATTAINED
  ).length;
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

const SkillGroup = ({ evaluationId, level, skillGroupId, skillsInGroup, skills, eventKey, updateSkillStatus, }) =>
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
                const { name, criteria, questions, status, error } = skills[skillId];

                return (
                  <Skill
                    evaluationId={evaluationId}
                    skillGroupId={skillGroupId}
                    key={level}
                    name={name}
                    skillId={skillId}
                    criteria={criteria}
                    questions={questions}
                    updateSkillStatus={updateSkillStatus}
                    status={status}
                    error={error}
                  />
                );
              })
          }
        </ListGroup>
      </Panel>
    </Accordion>
  );

SkillGroup.propTypes = {
  evaluationId: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  skillGroupId: PropTypes.number.isRequired,
  skillsInGroup: PropTypes.array.isRequired,
  skills: PropTypes.object.isRequired,
  eventKey: PropTypes.number.isRequired,
  updateSkillStatus: PropTypes.func.isRequired,
};

export default SkillGroup;
